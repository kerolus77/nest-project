import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { randomUUID } from 'node:crypto';
import { promises as fs } from 'node:fs';
import * as path from 'node:path';
import { Between, Like, Repository } from 'typeorm';
import { UsersService } from '../users/users.service.js';
import { CreateProductDto } from './dtos/create_product.dto.js';
import { UpdateProductDto } from './dtos/update_product.dto.js';
import { Product } from './product.entity.js';

@Injectable()
export class ProductsService {
    private readonly uploadDirectory = path.resolve(process.cwd(), 'uploads', 'products');

    constructor(
        @InjectRepository(Product)
        private readonly productRepository: Repository<Product>,
        private readonly usersService: UsersService
    ) {}



   async createProduct(dto:CreateProductDto, images: Express.Multer.File[], userId: string) {

       const user=await this.usersService.getUserById(userId);
       const imageUrls = await this.saveImages(images);

        try {
            const product = this.productRepository.create({ ...dto, imageUrls, user:{id:user.id} });
            return await this.productRepository.save(product);
        } catch (error) {
            await this.removeImageFiles(imageUrls);
            throw error;
        }
    }

    getAllProducts(name?: string,minPrice?: number,maxPrice?: number) {

        const filter={
            ...name? {name:Like(`%${name}%`)}:{},
            ...minPrice&&maxPrice? {price:Between(minPrice, maxPrice)}:{},
        }
        return this.productRepository.find({where:  filter });
    }

    async getProductById(id: number) {
        const product =await this.productRepository.findOneBy({ id });
        if (!product) {
            throw new NotFoundException('Product not found');
        }
        return product;
    }

    async updateProduct(id: number, dto: UpdateProductDto, images?: Express.Multer.File[]) {
        const product = await this.getProductById(id);
        const oldImageUrls = product.imageUrls;
        const imageUrls = images?.length ? await this.saveImages(images) : oldImageUrls;

        try {
            await this.productRepository.save({ ...product, ...dto, imageUrls });
        } catch (error) {
            if (imageUrls !== oldImageUrls) {
                await this.removeImageFiles(imageUrls);
            }
            throw error;
        }

        if (imageUrls !== oldImageUrls) {
            await this.removeImageFiles(oldImageUrls);
        }
        return this.getProductById(id);
    }

    async deleteProduct(id: number) {
        const product = await this.getProductById(id);
        const result = await this.productRepository.delete(id);
        await this.removeImageFiles(product.imageUrls);
        return result;
    }

    async deleteProductImage(id: number, imageName: string) {
        const product = await this.getProductById(id);
        const imageUrl = product.imageUrls.find((url) => path.basename(url) === imageName);
        if (!imageUrl) {
            throw new NotFoundException('Product image not found');
        }
        if (product.imageUrls.length === 1) {
            throw new BadRequestException('A product must have at least one image');
        }

        await this.productRepository.save({
            ...product,
            imageUrls: product.imageUrls.filter((url) => url !== imageUrl),
        });
        await this.removeImageFiles([imageUrl]);
    }

    private async saveImages(images: Express.Multer.File[]) {
        if (images.length < 1 || images.length > 5) {
            throw new BadRequestException('A product must have between 1 and 5 images');
        }

        await fs.mkdir(this.uploadDirectory, { recursive: true });
        const imageUrls: string[] = [];
        try {
            for (const image of images) {
                const extension = path.extname(image.originalname).toLowerCase();
                const fileName = `${randomUUID()}${extension}`;
                await fs.writeFile(path.join(this.uploadDirectory, fileName), image.buffer);
                imageUrls.push(`/uploads/products/${fileName}`);
            }
            return imageUrls;
        } catch (error) {
            await this.removeImageFiles(imageUrls);
            throw error;
        }
    }

    private async removeImageFiles(imageUrls: string[]) {
        await Promise.all(imageUrls.map((imageUrl) =>
            fs.rm(path.join(this.uploadDirectory, path.basename(imageUrl)), { force: true }),
        ));
    }
}

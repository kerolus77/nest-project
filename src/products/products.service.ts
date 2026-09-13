import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Like, Repository } from 'typeorm';
import { CreateProductDto } from './dtos/create_product.dto.js';
import { UpdateProductDto } from './dtos/update_product.dto.js';
import { Product } from './product.entity.js';

@Injectable()
export class ProductsService {
    constructor(
        @InjectRepository(Product)
        private readonly productRepository: Repository<Product>
    ) {}



    createProduct(dto:CreateProductDto, userId: string) {

       

        const product = this.productRepository.create({ ...dto, user:{id:userId} });
        return this.productRepository.save(product);
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

    updateProduct(id: number, dto: UpdateProductDto) {
        return this.productRepository.update(id, dto);
    }

    deleteProduct(id: number) {
        return this.productRepository.delete(id);
    }
}

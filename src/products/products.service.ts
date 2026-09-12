import { Injectable } from '@nestjs/common';
import { Product } from './product.entity.js';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateProductDto } from './dtos/create_product.dto.js';
import { UpdateProductDto } from './dtos/update_product.dto.js';

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

    getAllProducts() {
        return this.productRepository.find();
    }

    getProductById(id: number) {
        return this.productRepository.findOneBy({ id });
    }

    updateProduct(id: number, dto: UpdateProductDto) {
        return this.productRepository.update(id, dto);
    }

    deleteProduct(id: number) {
        return this.productRepository.delete(id);
    }
}

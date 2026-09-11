import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { CreateProductDto } from './dtos/create_product.dto.js';
import { ProductsService } from './products.service.js';

@Controller('api/products')
export class ProductsController {

    constructor(private readonly productsService: ProductsService) {}

    @Get()
    getProducts() {
        return this.productsService.getAllProducts();
    }

    @Get(':id')
    async getProductById (@Param('id',ParseIntPipe) id: number) {
        const product =await this.productsService.getProductById(id);
        if(!product) {
            return {
                message: `Product with id ${id} not found`
            }
        }
        return product;
    }

    @Post()
    createProduct(@Body() productData: CreateProductDto) {
        return this.productsService.createProduct(productData);
    }
   @Patch(':id')
    updateProduct(@Param('id',ParseIntPipe) id: number, @Body() updateData: CreateProductDto) {
        return this.productsService.updateProduct(id, updateData);
    }

    @Delete(':id')
    deleteProduct(@Param('id',ParseIntPipe) id: number) {
        return this.productsService.deleteProduct(id);
    }

}

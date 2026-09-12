import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { AuthRoleGuard } from '../auth/auth_role.guard.js';
import { CurrentUser } from '../auth/decorators/current_user.decorator.js';
import { Roles } from '../auth/decorators/user_role.decorator.js';
import { UserType } from '../uitils/enums.js';
import type { JwtPayload } from '../uitils/types.js';
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
    @Roles(UserType.ADMIN)
    @UseGuards (AuthRoleGuard)
    createProduct(@Body() productData: CreateProductDto,@CurrentUser() jwtPayload:JwtPayload) {
        return this.productsService.createProduct(productData, jwtPayload.id);
    }
   @Patch(':id')
   @Roles(UserType.ADMIN)
    @UseGuards (AuthRoleGuard)
    updateProduct(@Param('id',ParseIntPipe) id: number, @Body() updateData: CreateProductDto) {
        return this.productsService.updateProduct(id, updateData);
    }

    @Delete(':id')
    @Roles(UserType.ADMIN)
    @UseGuards (AuthRoleGuard)
    deleteProduct(@Param('id',ParseIntPipe) id: number) {
        return this.productsService.deleteProduct(id);
    }

}

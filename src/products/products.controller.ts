import { BadRequestException, Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Patch, Post, Query, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { AuthRoleGuard } from '../auth/auth_role.guard.js';
import { CurrentUser } from '../auth/decorators/current_user.decorator.js';
import { Roles } from '../auth/decorators/user_role.decorator.js';
import { UserType } from '../uitils/enums.js';
import type { JwtPayload } from '../uitils/types.js';
import { CreateProductDto } from './dtos/create_product.dto.js';
import { UpdateProductDto } from './dtos/update_product.dto.js';
import { ProductsService } from './products.service.js';

@Controller('api/products')
export class ProductsController {

    constructor(private readonly productsService: ProductsService) {}

    @Get()
    getProducts(@Query('name') name?: string, @Query('minPrice') minPrice?: number, @Query('maxPrice') maxPrice?: number) {
        return this.productsService.getAllProducts(name, minPrice, maxPrice);
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
    @UseInterceptors(FilesInterceptor('images', 5, {
        storage: memoryStorage(),
        limits: { fileSize: 5 * 1024 * 1024, files: 5 },
        fileFilter: (_, file, callback) => {
            if (!/^image\/(jpeg|png|webp|gif)$/.test(file.mimetype)) {
                return callback(new BadRequestException('Only JPEG, PNG, WebP, and GIF images are supported'), false);
            }
            callback(null, true);
        },
    }))
    createProduct(@Body() productData: CreateProductDto, @UploadedFiles() images: Express.Multer.File[], @CurrentUser() jwtPayload:JwtPayload) {
        if (!images?.length) {
            throw new BadRequestException('At least one product image is required');
        }
        
        return this.productsService.createProduct(productData, images, jwtPayload.id);
    }
   @Patch(':id')
   @Roles(UserType.ADMIN)
    @UseGuards (AuthRoleGuard)
    @UseInterceptors(FilesInterceptor('images', 5, {
        storage: memoryStorage(),
        limits: { fileSize: 5 * 1024 * 1024, files: 5 },
        fileFilter: (_, file, callback) => {
            if (!/^image\/(jpeg|png|webp|gif)$/.test(file.mimetype)) {
                return callback(new BadRequestException('Only JPEG, PNG, WebP, and GIF images are supported'), false);
            }
            callback(null, true);
        },
    }))
    updateProduct(@Param('id',ParseIntPipe) id: number, @Body() updateData: UpdateProductDto, @UploadedFiles() images: Express.Multer.File[]) {
        return this.productsService.updateProduct(id, updateData, images);
    }

    @Delete(':id/images/:imageName')
    @Roles(UserType.ADMIN)
    @UseGuards(AuthRoleGuard)
    @HttpCode(HttpStatus.NO_CONTENT)
    async deleteProductImage(@Param('id', ParseIntPipe) id: number, @Param('imageName') imageName: string) {
        await this.productsService.deleteProductImage(id, imageName);
    }

    @Delete(':id')
    @Roles(UserType.ADMIN)
    @UseGuards (AuthRoleGuard)
    deleteProduct(@Param('id',ParseIntPipe) id: number) {
        return this.productsService.deleteProduct(id);
    }

}

import { Module } from '@nestjs/common';
import { ProductsService } from './products.service.js';
import { ProductsController } from './products.controller.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './product.entity.js';

@Module({
    

  providers: [ProductsService],
    

  controllers: [ProductsController],
  imports: [
    TypeOrmModule.forFeature([
        Product
    ])
  ],
})
export class ProductsModule {}

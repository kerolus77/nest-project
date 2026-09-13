import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from '../users/users.module.js';
import { Product } from './product.entity.js';
import { ProductsController } from './products.controller.js';
import { ProductsService } from './products.service.js';

@Module({
    

  providers: [ProductsService],
    

  controllers: [ProductsController],
  exports:[ProductsService],
  imports: [
    TypeOrmModule.forFeature([
        Product
    ]),
    UsersModule
  ],
})
export class ProductsModule {}

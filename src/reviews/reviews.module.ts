import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Review } from './review.entity.js';
import { ReviewsController } from './reviews.controller.js';
import { ReviewsService } from './reviews.service.js';
import { UsersModule } from '../users/users.module.js';
import { ProductsModule } from '../products/products.module.js';

@Module({
  controllers: [ReviewsController],
  providers: [ReviewsService],
  imports: [TypeOrmModule.forFeature([Review]),UsersModule,ProductsModule]
})
export class ReviewsModule {}

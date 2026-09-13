
import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductsService } from '../products/products.service.js';
import { UsersService } from '../users/users.service.js';
import { CreateReviewDto } from './dtos/create_review.dto.js';
import { UpdateReviewDto } from './dtos/update_review.dto.js';
import { Review } from './review.entity.js';


@Injectable()
export class ReviewsService {
	constructor(
		@InjectRepository(Review)
		private readonly reviewRepository: Repository<Review>,
		private readonly productsService: ProductsService,
		private readonly usersService: UsersService

	) {}
    
	async createReview(dto: CreateReviewDto, productId: number, userId: string) {
        
	const user=await this.usersService.getUserById(userId);
		const product=await this.productsService.getProductById(productId);
		const review =  this.reviewRepository.create({...dto, product: {id: product?.id}, user: {id: user?.id}});
		return this.reviewRepository.save(review);
	}

	getAllReviews(page: number=0, limit: number=10) {
		return this.reviewRepository.find({
			skip: (page) * limit,
			take: limit
		});
	}

	async getReviewById(id: number) {
		const review =await this.reviewRepository.findOneBy({ id });
		if (!review) {
			throw new NotFoundException('Review not found');
		}
		return review;
	}

	async updateReview(id: number, dto: UpdateReviewDto, userId: string) {
		const review =await this.reviewRepository.findOne({where: { id }, relations: { user: true } });
         if (!review) {
			throw new NotFoundException('Review not found');
		}
		if (review.user?.id !== userId) {
			throw new UnauthorizedException('You are not the owner of this review');
		}
		return this.reviewRepository.update(id, dto);
	}

	async deleteReview(id: number, userId: string) {
		const review = await this.reviewRepository.findOne({ where: { id }, relations: { user: true } });
		if (!review) {
			throw new NotFoundException('Review not found');
		}
		if (review.user?.id !== userId) {
			throw new UnauthorizedException('You are not the owner of this review');
		}
		return this.reviewRepository.delete(id);
	}
}

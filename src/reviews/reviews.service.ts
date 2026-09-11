import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateReviewDto } from './dtos/create_review.dto.js';
import { UpdateReviewDto } from './dtos/update_review.dto.js';
import { Review } from './review.entity.js';

@Injectable()
export class ReviewsService {
	constructor(
		@InjectRepository(Review)
		private readonly reviewRepository: Repository<Review>
	) {}

	createReview(dto: CreateReviewDto) {
		const review = this.reviewRepository.create(dto);
		return this.reviewRepository.save(review);
	}

	getAllReviews() {
		return this.reviewRepository.find();
	}

	getReviewById(id: number) {
		return this.reviewRepository.findOneBy({ id });
	}

	updateReview(id: number, dto: UpdateReviewDto) {
		return this.reviewRepository.update(id, dto);
	}

	deleteReview(id: number) {
		return this.reviewRepository.delete(id);
	}
}

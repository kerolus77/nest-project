import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { CreateReviewDto } from './dtos/create_review.dto.js';
import { UpdateReviewDto } from './dtos/update_review.dto.js';
import { ReviewsService } from './reviews.service.js';

@Controller('api/reviews')
export class ReviewsController {

	constructor(private readonly reviewsService: ReviewsService) {}

	@Get()
	getReviews() {
		return this.reviewsService.getAllReviews();
	}

	@Get(':id')
	async getReviewById(@Param('id', ParseIntPipe) id: number) {
		const review = await this.reviewsService.getReviewById(id);
		if (!review) {
			return {
				message: `Review with id ${id} not found`
			};
		}
		return review;
	}

	@Post()
	createReview(@Body() reviewData: CreateReviewDto) {
		return this.reviewsService.createReview(reviewData);
	}

	@Patch(':id')
	updateReview(
		@Param('id', ParseIntPipe) id: number,
		@Body() updateData: UpdateReviewDto
	) {
		return this.reviewsService.updateReview(id, updateData);
	}

	@Delete(':id')
	deleteReview(@Param('id', ParseIntPipe) id: number) {
		return this.reviewsService.deleteReview(id);
	}
}

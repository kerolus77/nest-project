import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { CreateReviewDto } from './dtos/create_review.dto.js';
import { UpdateReviewDto } from './dtos/update_review.dto.js';
import { ReviewsService } from './reviews.service.js';
import { CurrentUser } from '../auth/decorators/current_user.decorator.js';
import type { JwtPayload } from '../uitils/types.js';
import { AuthGuard } from '../auth/auth.guard.js';
import { AuthRoleGuard } from '../auth/auth_role.guard.js';
import { Roles } from '../auth/decorators/user_role.decorator.js';
import { UserType } from '../uitils/enums.js';

@Controller('api/reviews')
export class ReviewsController {

	constructor(private readonly reviewsService: ReviewsService) {}

	@Get()
	@Roles(UserType.ADMIN)
	@UseGuards(AuthRoleGuard)
	getReviews(@Query('page') page?: number, @Query('limit') limit?: number) {
		return this.reviewsService.getAllReviews(page, limit);
	}

	@Get(':id')
	 getReviewById(@Param('id', ParseIntPipe) id: number) {
		return  this.reviewsService.getReviewById(id);
		
	}

	@Post(':productId')
	@UseGuards(AuthGuard)
	createReview(@Body() reviewData: CreateReviewDto,
	@Param('productId', ParseIntPipe) productId: number,
@CurrentUser() jwtPayload:JwtPayload) {
		return this.reviewsService.createReview(reviewData, productId,jwtPayload.id);
	}

	@Patch(':id')
	@UseGuards(AuthGuard)
	updateReview(
		@Param('id', ParseIntPipe) id: number,
		@Body() updateData: UpdateReviewDto,
		@CurrentUser() jwtPayload: JwtPayload
	) {
		return this.reviewsService.updateReview(id, updateData, jwtPayload.id);
	}

	@Delete(':id')
	@UseGuards(AuthGuard)
	deleteReview(@Param('id', ParseIntPipe) id: number, 
	@CurrentUser() jwtPayload: JwtPayload) {
		return this.reviewsService.deleteReview(id, jwtPayload.id);
	}
}

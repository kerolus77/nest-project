import { PartialType } from "@nestjs/mapped-types";
import { CreateReviewDto } from "./create_review.dto.js";

export class UpdateReviewDto extends PartialType(CreateReviewDto) {}
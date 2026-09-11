import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString, Length, Max, Min } from "class-validator";

export class CreateReviewDto {
   
    @IsString()
    @IsNotEmpty()
    @Length(5, 500)
    @ApiProperty({ description: 'comment of the review' })
    comment: string;

    @IsNumber()
    @Min(1)
    @Max(5)
    @ApiProperty({ description: 'rating of the review' })
    rating: number;
}
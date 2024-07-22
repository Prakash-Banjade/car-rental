import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsOptional, IsString, Max, Min } from "class-validator";

export class CreateReviewDto {
    @ApiProperty({ type: String, description: 'Model Slug' })
    @IsString()
    @IsNotEmpty()
    modelSlug: string; // model slug

    @ApiProperty({ type: Number, description: 'Model Rating' })
    @IsNumber()
    @Min(0)
    @Max(5)
    rating: number;

    @ApiProperty({ type: String, description: 'Model Comment' })
    @IsString()
    @IsNotEmpty()
    @IsOptional()
    comment?: string;
}

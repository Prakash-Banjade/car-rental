import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsOptional, IsString, Max, Min } from "class-validator";
import { QueryDto } from "src/core/dto/query.dto";

export class ReviewQueryDto extends QueryDto {
    @ApiProperty({ type: Number, description: 'Model Rating' })
    @IsNumber()
    @Min(0)
    @Max(5)
    @IsOptional()
    rating?: number;

    @ApiProperty({ type: String, description: 'Model Name' })
    @IsString()
    @IsOptional()
    modelName?: string

    @ApiProperty({ type: Number, description: 'Model Rating from' })
    @IsNumber()
    @Min(0)
    @Max(5)
    @IsOptional()
    ratingFrom?: number

    @ApiProperty({ type: Number, description: 'Model Rating to' })
    @IsNumber()
    @Min(0)
    @Max(5)
    @IsOptional()
    ratingTo?: number
}
import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsString } from "class-validator";
import { QueryDto } from "src/core/dto/query.dto";

export class ModelQueryDto extends QueryDto {
    @ApiPropertyOptional()
    @IsString()
    brandSlug?: string;

    @ApiPropertyOptional()
    @IsString()
    carTypeSlug?: string;
}
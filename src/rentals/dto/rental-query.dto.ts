import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";
import { QueryDto } from "src/core/dto/query.dto";

export class RentalQueryDto extends QueryDto {
    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    rentalId?: string;
    
    @ApiPropertyOptional({ type: String, example: "true" })
    @IsString()
    @IsOptional()
    recent: string;
}
import { BadRequestException } from "@nestjs/common";
import { ApiPropertyOptional } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsOptional, IsString } from "class-validator";
import { QueryDto } from "src/core/dto/query.dto";
import { EFuelType } from "src/core/types/global.types";

export class ModelQueryDto extends QueryDto {
    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    brand?: string;

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    carType?: string;

    @ApiPropertyOptional({ enum: EFuelType })
    @IsString()
    @IsOptional()
    fuelType?: EFuelType;

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    color: string

    @ApiPropertyOptional({ type: String, description: 'Model Rating From' })
    @Transform(({ value }) => {
        if (isNaN(Number(value))) throw new BadRequestException('Invalid rating from');
        if (Number(value) > 5 || Number(value) < 0) throw new BadRequestException('Invalid rating from');
        return Number(value);
    })
    @IsOptional()
    ratingFrom?: number = 0;

    @Transform(({ value }) => {
        if (isNaN(Number(value))) throw new BadRequestException('Invalid rating to');
        if (Number(value) > 5 || Number(value) < 0) throw new BadRequestException('Invalid rating from');
        return Number(value);
    })
    @IsOptional()
    ratingTo?: number;

    @ApiPropertyOptional({ type: String, description: 'Model Power From' })
    @Transform(({ value }) => {
        if (isNaN(Number(value))) throw new BadRequestException('Invalid power from');
        if (Number(value) > 5 || Number(value) < 0) throw new BadRequestException('Invalid power from');
        return Number(value);
    })
    @IsOptional()
    powerFrom?: number = 0;

    @Transform(({ value }) => {
        if (isNaN(Number(value))) throw new BadRequestException('Invalid power to');
        if (Number(value) > 5 || Number(value) < 0) throw new BadRequestException('Invalid power from');
        return Number(value);
    })
    @IsOptional()
    powerTo?: number;
}
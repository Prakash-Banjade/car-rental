import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsEnum } from "class-validator";
import { ERentalStatus } from "src/core/types/global.types";

export class UpdateRentalItemDto {
    @ApiPropertyOptional({ type: 'enum', enum: ERentalStatus, description: 'Rental status' })
    @IsEnum(ERentalStatus)
    status: ERentalStatus;
}
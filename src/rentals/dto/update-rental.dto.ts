import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { CreateRentalDto } from './create-rental.dto';
import { ERentalStatus } from 'src/core/types/global.types';
import { IsEnum } from 'class-validator';

export class UpdateRentalDto {
    @ApiPropertyOptional({ type: 'enum', enum: ERentalStatus, description: 'Rental status' })
    @IsEnum(ERentalStatus)
    status: ERentalStatus;
}

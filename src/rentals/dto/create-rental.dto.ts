import { ApiProperty } from "@nestjs/swagger";
import { IsDateString, IsEnum, IsNotEmpty, IsString } from "class-validator";
import { PaymentMethod } from "src/core/types/global.types";

export class CreateRentalDto {
    @ApiProperty({ type: 'string', description: 'Model slug' })
    @IsString()
    @IsNotEmpty()
    modelSlug: string;

    @ApiProperty({ type: 'string', format: 'date-time', description: 'Rental start date' })
    @IsDateString()
    @IsNotEmpty()
    startDate: string;

    @ApiProperty({ type: 'string', format: 'date-time', description: 'Rental end date' })
    @IsDateString()
    @IsNotEmpty()
    endDate: string;

    @ApiProperty({ type: 'string', description: 'Pickup location' })
    @IsString()
    @IsNotEmpty()
    pickupLocation: string;

    @ApiProperty({ type: 'string', description: 'Return location' })
    @IsString()
    @IsNotEmpty()
    returnLocation: string;

    @ApiProperty({ type: 'enum', enum: PaymentMethod, description: 'Payment method' })
    @IsEnum(PaymentMethod)
    paymentMethod: PaymentMethod;
}

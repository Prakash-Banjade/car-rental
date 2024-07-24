import { ApiProperty } from "@nestjs/swagger";
import { ArrayMinSize, IsArray, IsDefined, IsEnum, IsNotEmpty, ValidateNested } from "class-validator";
import { PaymentMethod } from "src/core/types/global.types";
import { CreateRentalItemsDto } from "./createRentalItems.dto";
import { Type } from "class-transformer";

export class CreateRentalDto {
    @ApiProperty({ type: 'enum', enum: PaymentMethod, description: 'Payment method' })
    @IsEnum(PaymentMethod)
    paymentMethod: PaymentMethod;

    @ApiProperty({ type: [CreateRentalItemsDto], isArray: true, description: 'Rental items' })
    @IsNotEmpty()
    @IsArray()
    @ArrayMinSize(1)
    @ValidateNested({ each: true })
    @Type(() => CreateRentalItemsDto)
    @IsDefined()
    rentalItems: CreateRentalItemsDto[];
}

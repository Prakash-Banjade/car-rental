import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString, IsUUID } from "class-validator";

export class CreateCarTypeDto {
    @ApiProperty({ type: 'string', description: 'Name of the car type' })
    @IsString()
    @IsNotEmpty()
    name: string

    @ApiProperty({ type: 'string', description: 'Description of the car type' })
    @IsString()
    @IsNotEmpty()
    description: string

    @ApiProperty({ type: 'string', description: 'Image of the car type' })
    @IsUUID()
    @IsNotEmpty()
    imageId: string

    // @ApiPropertyOptional({ type: 'string', description: 'Slug of the car type' })
    // @IsString()
    // @IsOptional()
    // slug: string
}

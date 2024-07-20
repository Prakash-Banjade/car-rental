import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString, IsUrl, IsUUID } from "class-validator";

export class CreateBrandDto {
    @ApiProperty({ type: 'string', description: 'Name of the brand' })
    @IsNotEmpty()
    @IsString()
    name: string

    @ApiProperty({ type: 'string', description: 'Logo of the brand' })
    @IsNotEmpty()
    @IsUUID()
    logoId: string

    @ApiProperty({ type: 'string', description: 'Description of the brand' })
    @IsNotEmpty()
    @IsString()
    description: string

    @ApiPropertyOptional({ type: 'string', format: 'url', description: 'Website of the brand' })
    @IsOptional()
    @IsUrl()
    website: string

    @ApiPropertyOptional({ type: 'string', description: 'Slug for the brand' })
    @IsOptional()
    @IsString()
    slug: string
}

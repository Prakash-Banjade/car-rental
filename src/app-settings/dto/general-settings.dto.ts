import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString, IsUUID } from "class-validator";

export class GeneralSettingsDto {
    @ApiProperty({ type: String, description: 'Site title' })
    @IsString()
    @IsNotEmpty()
    @IsOptional()
    companyName?: string;

    @ApiProperty({ type: String, description: 'Site title' })
    @IsString()
    @IsNotEmpty()
    @IsOptional()
    siteTitle: string;

    @ApiPropertyOptional({ type: String, description: 'Site subtitle' })
    @IsString()
    @IsNotEmpty()
    @IsOptional()
    siteSubtitle?: string;

    @ApiProperty({ type: String, format: 'uuid', description: 'Site logo' })
    @IsUUID()
    @IsOptional()
    logoId?: string;

    @ApiPropertyOptional({ type: String, format: 'uuid', description: 'Site collapseLogo logo' })
    @IsUUID()
    @IsOptional()
    collapseLogoId?: string;

    @ApiPropertyOptional({ type: String, description: 'Footer description' })
    @IsString()
    @IsOptional()
    footerDescription?: string;
}
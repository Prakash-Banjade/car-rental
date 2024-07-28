import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString, IsUrl, IsUUID } from "class-validator";

export class SeoSettingsDto {
    @ApiPropertyOptional({ type: String, description: 'Meta title' })
    @IsString()
    @IsNotEmpty()
    @IsOptional()
    metaTitle?: string;

    @ApiPropertyOptional({ type: String, description: 'Meta Tags' })
    @IsString()
    @IsNotEmpty()
    @IsOptional()
    metaTags?: string;

    @ApiPropertyOptional({ type: String, description: 'Meta Description' })
    @IsString()
    @IsNotEmpty()
    @IsOptional()
    metaDescription?: string;

    @ApiPropertyOptional({ type: String, description: 'Canonical URL' })
    @IsUrl()
    @IsNotEmpty()
    @IsOptional()
    canonicalUrl?: string;

    @ApiPropertyOptional({ type: String, description: 'OG Title' })
    @IsString()
    @IsNotEmpty()
    @IsOptional()
    ogTitle?: string;

    @ApiPropertyOptional({ type: String, description: 'OG Description' })
    @IsString()
    @IsNotEmpty()
    @IsOptional()
    ogDescription?: string;

    @ApiPropertyOptional({ type: String, description: 'OG Image' })
    @IsUUID()
    @IsOptional()
    ogImageId?: string;

    @ApiPropertyOptional({ type: String, description: 'Twitter username' })
    @IsString()
    @IsNotEmpty()
    @IsOptional()
    twitterUsername?: string;
}

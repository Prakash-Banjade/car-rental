import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsNotEmpty, IsOptional, IsString, IsUUID } from "class-validator";
import { generateSlug } from "src/core/utils/generateSlug";

export class CreateBlogDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    title: string;

    @ApiProperty()
    @IsString()
    @Transform(({ value }) => generateSlug(value))
    @IsOptional()
    slug?: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    summary?: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    content: string;

    @ApiProperty()
    @IsUUID()
    @IsNotEmpty()
    featuredImageId: string;

    @ApiProperty()
    @IsUUID()
    @IsOptional()
    coverImageId?: string;
}

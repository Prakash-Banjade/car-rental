import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString } from "class-validator";
import { FileSystemStoredFile, HasMimeType, IsFile, MaxFileSize } from "nestjs-form-data";

export class ImageGalleryDto {
    @ApiProperty({ type: String, format: 'binary', isArray: true, description: 'Images' })
    @HasMimeType(['image/png', 'image/jpg', 'image/jpeg'], { each: true })
    @IsFile({ each: true })
    @MaxFileSize(5 * 1024 * 1024, { each: true })
    @IsNotEmpty({ each: true })
    images: FileSystemStoredFile[]

    @ApiProperty()
    @IsString()
    @IsOptional()
    name?: string
}

import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString } from "class-validator";
import { FileSystemStoredFile, HasMimeType, IsFile, MaxFileSize } from "nestjs-form-data";

export class CreateImageDto {
    @ApiProperty({ type: String, format: 'binary', description: 'Image' })
    @HasMimeType(['image/png', 'image/jpg', 'image/jpeg'])
    @IsFile()
    @MaxFileSize(5 * 1024 * 1024)
    @IsNotEmpty()
    image: FileSystemStoredFile

    @ApiProperty()
    @IsString()
    @IsOptional()
    name?: string
}

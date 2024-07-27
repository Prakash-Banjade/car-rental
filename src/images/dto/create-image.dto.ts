import { ApiProperty, OmitType } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString } from "class-validator";
import { HasMimeType, IsFile, MaxFileSize, MemoryStoredFile } from "nestjs-form-data";

export class CreateImageDto {
    @ApiProperty({ type: String, format: 'binary', description: 'Image' })
    @HasMimeType(['image/png', 'image/jpg', 'image/jpeg'])
    @IsFile()
    @MaxFileSize(5 * 1024 * 1024)
    @IsNotEmpty()
    image: MemoryStoredFile

    @ApiProperty()
    @IsString()
    @IsOptional()
    name?: string
}

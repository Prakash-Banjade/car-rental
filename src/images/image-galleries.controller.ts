import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AuthUser } from 'src/core/types/global.types';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { FileSystemStoredFile, FormDataRequest } from 'nestjs-form-data';
import { CurrentUser } from 'src/core/decorators/user.decorator';
import { ImageGalleriesService } from './image-galleries.service';
import { ImageGalleryDto } from './dto/image-gallery.dto';

@ApiBearerAuth()
@ApiTags('Upload ImageGallery')
@Controller('galleries') // route-path: /upload/galleries
export class ImageGalleriesController {
    constructor(private readonly imageGalleriesService: ImageGalleriesService) { }

    @Post()
    @FormDataRequest({ storage: FileSystemStoredFile })
    upload(@Body() imageGalleryDto: ImageGalleryDto, @CurrentUser() currentUser: AuthUser) {
        return this.imageGalleriesService.upload(imageGalleryDto, currentUser);
    }

    @Get()
    findAll() {
        return this.imageGalleriesService.findAll();
    }

    // @Get(':id')
    // findOne(@Param('id') id: string) {
    //   return this.imageGalleriesService.findOne(id);
    // }

    @Patch(':id')
    @FormDataRequest({ storage: FileSystemStoredFile })
    update(@Param('id') id: string, @Body() imageGalleryDto: ImageGalleryDto, @CurrentUser() currentUser: AuthUser) {
        return this.imageGalleriesService.update(id, imageGalleryDto, currentUser);
    }

    @Delete(':id')
    remove(@Param('id') id: string, @CurrentUser() currentUser: AuthUser) {
        return this.imageGalleriesService.remove(id, currentUser);
    }
}

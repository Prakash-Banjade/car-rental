import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ImagesService } from './images.service';
import { CreateImageDto } from './dto/create-image.dto';
import { UpdateImageDto } from './dto/update-image.dto';
import { AuthUser } from 'src/core/types/global.types';
import { ApiTags } from '@nestjs/swagger';
import { FileSystemStoredFile, FormDataRequest } from 'nestjs-form-data';

@ApiTags('Upload Images')
@Controller('images') // route-path: /upload/images
export class ImagesController {
  constructor(private readonly imagesService: ImagesService) { }

  @Post()
  @FormDataRequest({ storage: FileSystemStoredFile, limits: { files: 1 } })
  upload(@Body() createImageDto: CreateImageDto, currentUser: AuthUser) {
    return this.imagesService.upload(createImageDto, currentUser);
  }

  @Get()
  findAll() {
    return this.imagesService.findAll();
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.imagesService.findOne(id);
  // }

  @Patch(':id')
  @FormDataRequest({ storage: FileSystemStoredFile, limits: { files: 1 } })
  update(@Param('id') id: string, @Body() updateImageDto: UpdateImageDto, currentUser: AuthUser) {
    return this.imagesService.update(id, updateImageDto, currentUser);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.imagesService.remove(id);
  }
}

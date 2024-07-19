import { Module } from '@nestjs/common';
import { ImagesService } from './images.service';
import { ImagesController } from './images.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Image } from './entities/image.entity';
import { AccountsModule } from 'src/accounts/accounts.module';
import { ImageGallery } from './entities/image-gallery.entity';
import { ImageGalleriesController } from './image-galleries.controller';
import { ImageGalleriesService } from './image-galleries.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Image,
      ImageGallery
    ]),
    AccountsModule,
  ],
  controllers: [ImagesController, ImageGalleriesController],
  providers: [ImagesService, ImageGalleriesService],
})
export class ImagesModule { }

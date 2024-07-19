import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuthUser } from 'src/core/types/global.types';
import { ImageGallery } from './entities/image-gallery.entity';
import { ImageGalleryDto } from './dto/image-gallery.dto';
import { ImagesService } from './images.service';
import { CreateImageDto } from './dto/create-image.dto';

@Injectable()
export class ImageGalleriesService {
    constructor(
        @InjectRepository(ImageGallery) private imageGalleriesRepo: Repository<ImageGallery>,
        private readonly imagesService: ImagesService
    ) { }

    async upload(imageGalleryDto: ImageGalleryDto, currentUser: AuthUser) {
        const newImageGallery = this.imageGalleriesRepo.create({
            name: imageGalleryDto.name,
        })
        const savedImageGallery = await this.imageGalleriesRepo.save(newImageGallery);

        const createImageDtos: CreateImageDto[] = imageGalleryDto.images.map(image => ({
            image,
            name: imageGalleryDto.name
        }))

        const response = await this.imagesService.uploadInBulk(createImageDtos, savedImageGallery, currentUser);

        return response
    }

    async findAll() {
        return await this.imageGalleriesRepo.find({ order: { createdAt: 'DESC' }, relations: { images: true } })
    }

    async findOne(id: string, currentUser?: AuthUser) {
        const existingImageGallery = await this.imageGalleriesRepo.findOne({
            where: {
                id,
                images: {
                    uploadedBy: {
                        id: currentUser?.accountId
                    }
                }
            },
            relations: {
                images: true
            }
        });
        if (!existingImageGallery) throw new NotFoundException('ImageGallery not found');

        return existingImageGallery
    }

    async update(id: string, imageGalleryDto: ImageGalleryDto, currentUser: AuthUser) {
        const existing = await this.findOne(id, currentUser?.role !== 'admin' ? currentUser : undefined);

        const createImageDtos: CreateImageDto[] = imageGalleryDto.images.map(image => ({
            image,
            name: imageGalleryDto.name
        }))

        const response = await this.imagesService.uploadInBulk(createImageDtos, existing, currentUser);

        return response;
    }

    async remove(id: string, currentUser: AuthUser) {
        const existing = await this.findOne(id, currentUser);
        await this.imageGalleriesRepo.remove(existing);
        return {
            message: 'Gallery deleted'
        }
    }
}

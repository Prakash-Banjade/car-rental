import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateImageDto } from './dto/create-image.dto';
import { UpdateImageDto } from './dto/update-image.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Image } from './entities/image.entity';
import { In, Repository } from 'typeorm';
import { AuthUser } from 'src/core/types/global.types';
import { getImageMetadata } from 'src/core/utils/getImageMetadata';
import { AccountsService } from 'src/accounts/accounts.service';

@Injectable()
export class ImagesService {
  constructor(
    @InjectRepository(Image) private imagesRepository: Repository<Image>,
    private readonly accountService: AccountsService
  ) { }

  async upload(createImageDto: CreateImageDto, currentUser: AuthUser) {
    const metaData = getImageMetadata(createImageDto.image);
    const account = await this.accountService.findOne(currentUser.accountId);

    const image = this.imagesRepository.create({
      ...metaData,
      name: createImageDto.name || account.firstName + ' ' + account.lastName,
      uploadedBy: account
    })

    const savedImage = await this.imagesRepository.save(image);

    return {
      message: 'Image Uploaded',
      image: {
        url: savedImage.url,
        id: savedImage.id
      }
    }
  }

  async findAll() {
    return `This action returns all images`;
  }

  async findAllByIds(ids: string[]) {
    return await this.imagesRepository.find({
      where: {
        id: In(ids)
      }
    })
  }

  async findOne(id: string, currentUser?: AuthUser) {
    const existingImage = await this.imagesRepository.findOne({
      where: {
        id,
        uploadedBy: {
          id: currentUser?.accountId
        }
      },
    });
    if (!existingImage) throw new NotFoundException('Image not found');

    return existingImage
  }

  async update(id: string, updateImageDto: UpdateImageDto, currentUser: AuthUser) {
    const existing = await this.findOne(id, currentUser?.role !== 'admin' ? currentUser : undefined);

    if (!updateImageDto.image) { // only name is provided
      existing.name = updateImageDto.name;
      const savedImage = await this.imagesRepository.save(existing);
      return {
        message: 'Image updated',
        image: {
          url: savedImage.url,
          id: savedImage.id
        }
      }
    }

    // image is provided
    const metaData = getImageMetadata(updateImageDto.image);

    existing.url = metaData.url;
    existing.memeType = metaData.memeType;
    existing.size = metaData.size;

    const savedImage = await this.imagesRepository.save(existing);

    return {
      message: 'Image updated',
      image: {
        url: savedImage.url,
        id: savedImage.id
      }
    }
  }

  async remove(id: string, currentUser: AuthUser) {
    const existing = await this.findOne(id, currentUser);
    await this.imagesRepository.remove(existing);
    return {
      message: 'Image deleted successfully'
    }
  }
}

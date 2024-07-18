import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateImageDto } from './dto/create-image.dto';
import { UpdateImageDto } from './dto/update-image.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Image } from './entities/image.entity';
import { Repository } from 'typeorm';
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
    const account = await this.accountService.findOne(currentUser.userId);

    const image = this.imagesRepository.create({
      ...metaData,
      name: createImageDto.name || account.firstName + ' ' + account.lastName,
      uploadedBy: account
    })

    const savedImage = await this.imagesRepository.save(image);

    return {
      url: savedImage.url
    }
  }

  async findAll() {
    return `This action returns all images`;
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
    const metaData = getImageMetadata(updateImageDto.image);

    existing.url = metaData.url;
    existing.memeType = metaData.memeType;
    existing.size = metaData.size;

    const savedImage = await this.imagesRepository.save(existing);

    return {
      url: savedImage.url
    }
  }

  async remove(id: string) {
    const existing = await this.findOne(id);
    await this.imagesRepository.remove(existing);
    return {
      message: 'Image deleted successfully'
    }
  }
}

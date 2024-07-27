import { Injectable, NotFoundException, Res } from '@nestjs/common';
import { CreateImageDto } from './dto/create-image.dto';
import { UpdateImageDto } from './dto/update-image.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Image } from './entities/image.entity';
import { Brackets, In, Like, Repository } from 'typeorm';
import { AuthUser, Roles } from 'src/core/types/global.types';
import { getImageMetadata } from 'src/core/utils/getImageMetadata';
import { AccountsService } from 'src/accounts/accounts.service';
import { QueryDto } from 'src/core/dto/query.dto';
import paginatedData from 'src/core/utils/paginatedData';
import path from 'path';
import fs from 'fs';
import { Response } from 'express';

@Injectable()
export class ImagesService {
  constructor(
    @InjectRepository(Image) private imagesRepository: Repository<Image>,
    private readonly accountService: AccountsService
  ) { }

  async upload(createImageDto: CreateImageDto, currentUser: AuthUser) {
    const metaData = await getImageMetadata(createImageDto.image);

    const account = await this.accountService.findOne(currentUser.accountId);

    const image = this.imagesRepository.create({
      ...metaData,
      name: createImageDto.name || metaData.originalName,
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

  async findAll(queryDto: QueryDto, currentUser: AuthUser) {
    const queryBuilder = this.imagesRepository.createQueryBuilder('image');

    queryBuilder
      .orderBy('image.createdAt', 'DESC')
      .skip(queryDto.skip)
      .take(queryDto.take)
      .leftJoin('image.uploadedBy', 'account')
      .where(new Brackets(qb => {
        currentUser.role !== Roles.ADMIN && qb.where({ uploadedBy: { id: currentUser.accountId } })
      }))
      .select([
        'image', 'account.id', 'account.firstName', 'account.lastName', 'account.email',
      ])

    return paginatedData(queryDto, queryBuilder);
  }

  async findAllByIds(ids: string[]) {
    return await this.imagesRepository.find({
      where: {
        id: In(ids)
      }
    })
  }

  async findOne(slug: string, currentUser?: AuthUser) {
    const existingImage = await this.imagesRepository.findOne({
      where: {
        url: Like(`%${slug}`),
        uploadedBy: {
          id: currentUser?.accountId
        }
      },
    });
    if (!existingImage) throw new NotFoundException('Image not found');



    return existingImage
  }

  async serveImage(filename: string, @Res() res: Response) {
    const imagePath = path.join(process.cwd(), 'public', filename);

    fs.stat(imagePath, (err, stats) => {
      if (err) {
        if (err.code === 'ENOENT') {
          throw new NotFoundException('Image not found');
        } else {
          throw new Error(err.message);
        }
      }

      // Set appropriate headers
      res.setHeader('Content-Type', 'image/' + path.extname(filename).substring(1));
      res.setHeader('Content-Length', stats.size);

      // Stream the file to the response
      const readStream = fs.createReadStream(imagePath);
      readStream.pipe(res);
    });
  }

  async update(id: string, updateImageDto: UpdateImageDto, currentUser: AuthUser) {
    const existing = await this.findOne(id, currentUser?.role !== 'admin' ? currentUser : undefined);

    // update image name only
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

  async remove(id: string, currentUser: AuthUser) {
    const existing = await this.findOne(id, currentUser);
    await this.imagesRepository.remove(existing);
    return {
      message: 'Image deleted successfully'
    }
  }
}

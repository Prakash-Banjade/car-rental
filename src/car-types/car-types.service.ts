import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { Brackets, IsNull, Not, Or, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ImagesService } from 'src/images/images.service';
import { Deleted, QueryDto } from 'src/core/dto/query.dto';
import paginatedData from 'src/core/utils/paginatedData';
import { CarType } from './entities/car-type.entity';
import { CreateCarTypeDto } from './dto/create-car-type.dto';
import { UpdateCarTypeDto } from './dto/update-car-type.dto';

@Injectable()
export class CarTypesService {
  constructor(
    @InjectRepository(CarType) private readonly carTypeRepository: Repository<CarType>,
    private readonly imageService: ImagesService
  ) { }

  async create(createCarTypeDto: CreateCarTypeDto) {
    const existingCarType = await this.carTypeRepository.findOneBy({ name: createCarTypeDto.name });
    if (existingCarType) throw new ConflictException('CarType already exists');

    const image = await this.imageService.findOne(createCarTypeDto.imageId);

    const carType = this.carTypeRepository.create({
      name: createCarTypeDto.name,
      image: image,
      slug: createCarTypeDto.slug,
      description: createCarTypeDto.description,
    });

    const savedCarType = await this.carTypeRepository.save(carType);

    return {
      message: 'Car type created',
      carType: {
        id: savedCarType.id,
        name: savedCarType.name,
        slug: savedCarType.slug,
      }
    }
  }

  async findAll(queryDto: QueryDto) {
    const queryBuilder = this.carTypeRepository.createQueryBuilder('carType');
    const deletedAt = queryDto.deleted === Deleted.ONLY ? Not(IsNull()) : queryDto.deleted === Deleted.NONE ? IsNull() : Or(IsNull(), Not(IsNull()));

    queryBuilder
      .orderBy("carType.createdAt", queryDto.order)
      .skip(queryDto.skip)
      .take(queryDto.take)
      .withDeleted()
      .where({ deletedAt })
      .leftJoin("carType.image", "image")
      .andWhere(new Brackets(qb => {
        queryDto.search && qb.andWhere('carType.name = :carTypeName', { carTypeName: queryDto.search });
      }))
      .select([
        'carType.id', 'carType.name', 'carType.description', 'image.id', 'image.url', 'carType.createdAt', 'carType.slug',
      ])

    return paginatedData(queryDto, queryBuilder);
  }

  async findOne(id: string) {
    const existingCarType = await this.carTypeRepository.findOne({
      where: { id },
      relations: {
        image: true,
      },
      select: {
        image: {
          url: true,
          id: true,
        }
      }
    });
    if (!existingCarType) throw new NotFoundException('CarType not found');

    return existingCarType;
  }

  async update(id: string, updateCarTypeDto: UpdateCarTypeDto) {
    const existingCarType = await this.findOne(id);

    const image = updateCarTypeDto.imageId && (existingCarType.image.id !== updateCarTypeDto.imageId)
      ? await this.imageService.findOne(updateCarTypeDto.imageId)
      : null;

    Object.assign(existingCarType, {
      ...updateCarTypeDto,
      image: image,
    });

    const savedCarType = await this.carTypeRepository.save(existingCarType);

    return {
      message: 'CarType updated',
      carType: {
        id: savedCarType.id,
        name: savedCarType.name,
      }
    }
  }

  async remove(id: string) {
    const existingCarType = await this.findOne(id);
    await this.carTypeRepository.remove(existingCarType);

    return {
      message: 'CarType removed',
    }
  }
}

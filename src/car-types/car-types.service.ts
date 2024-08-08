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
    const existingCarType = await this.carTypeRepository.findOne({
      where: [
        { name: createCarTypeDto.name },
      ]
    });
    if (existingCarType) throw new ConflictException('Car type with that name or slug already exists');

    const image = await this.imageService.findOne(createCarTypeDto.imageId);

    const carType = this.carTypeRepository.create({
      name: createCarTypeDto.name,
      image: image,
      description: createCarTypeDto.description,
    });

    const savedCarType = await this.carTypeRepository.save(carType);

    return this.carTypeMutationReturn(savedCarType, 'create');
  }

  async findAll(queryDto: QueryDto) {
    const queryBuilder = this.carTypeRepository.createQueryBuilder('carType');
    const deletedAt = queryDto.deleted === Deleted.ONLY ? Not(IsNull()) : queryDto.deleted === Deleted.NONE ? IsNull() : Or(IsNull(), Not(IsNull()));

    queryBuilder
      .orderBy("carType.createdAt", queryDto.order)
      .skip(queryDto.skipPagination === 'true' ? undefined : queryDto.skip)
      .take(queryDto.skipPagination === 'true' ? undefined : queryDto.take)
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

  async findOne(slug: string) {
    const existingCarType = await this.carTypeRepository.findOne({
      where: { slug },
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

  async update(slug: string, updateCarTypeDto: UpdateCarTypeDto) {
    const foundCarType = await this.findOne(slug);

    // check if name or slug is already taken
    if (foundCarType.name !== updateCarTypeDto.name) {
      const existingCarType = await this.carTypeRepository.findOne({
        where: [
          { name: updateCarTypeDto.name },
        ]
      });
      if (existingCarType && existingCarType.id !== foundCarType.id) throw new ConflictException('Car type with that name or slug already exists');
    }

    // Check if image has been changed
    const image = updateCarTypeDto.imageId && (foundCarType.image.id !== updateCarTypeDto.imageId)
      ? await this.imageService.findOne(updateCarTypeDto.imageId)
      : foundCarType.image;

    Object.assign(foundCarType, {
      ...updateCarTypeDto,
      image: image,
    });

    const savedCarType = await this.carTypeRepository.save(foundCarType);

    return this.carTypeMutationReturn(savedCarType, 'update');
  }

  async remove(slug: string) {
    const existingCarType = await this.findOne(slug);
    await this.carTypeRepository.remove(existingCarType);

    return {
      message: 'CarType removed',
    }
  }

  async carTypeMutationReturn(carType: CarType, type: 'create' | 'update') {
    return {
      message: `${type === 'create' ? 'Car type created' : 'Car type updated'}`,
      carType: {
        id: carType.id,
        name: carType.name,
        slug: carType.slug,
      }
    }
  }
}

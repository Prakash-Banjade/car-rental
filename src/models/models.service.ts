import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateModelDto } from './dto/create-model.dto';
import { UpdateModelDto } from './dto/update-model.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Model } from './entities/model.entity';
import { Brackets, IsNull, Not, Or, Repository } from 'typeorm';
import { ImagesService } from 'src/images/images.service';
import { ModelQueryDto } from './dto/model-query.dto';
import { Deleted } from 'src/core/dto/query.dto';
import paginatedData from 'src/core/utils/paginatedData';
import { BrandsService } from 'src/brands/brands.service';
import { CarTypesService } from 'src/car-types/car-types.service';
import { modelColumnsConfig, modelsColumnsConfig } from './entities/model-select-cols';
import { applySelectColumns } from 'src/core/utils/apply-select-cols';

@Injectable()
export class ModelsService {
  constructor(
    @InjectRepository(Model) private readonly modelsRepo: Repository<Model>,
    private readonly imagesService: ImagesService,
    private readonly brandsService: BrandsService,
    private readonly carTypesService: CarTypesService,
  ) { }

  async create(createModelDto: CreateModelDto) {
    const featuredImage = await this.imagesService.findOne(createModelDto.featuredImageId);
    const brand = await this.brandsService.findOne(createModelDto.brandSlug);
    const gallery = await this.imagesService.findAllByIds(createModelDto.galleryIds);
    const carType = await this.carTypesService.findOne(createModelDto.carTypeSlug);

    const newModel = this.modelsRepo.create({
      ...createModelDto,
      featuredImage,
      brand,
      gallery,
      carType
    })

    const savedModel = await this.modelsRepo.save(newModel);

    return this.modelMutationReturn(savedModel, 'create');
  }

  async findAll(queryDto: ModelQueryDto) {
    const queryBuilder = this.modelsRepo.createQueryBuilder('model');
    const deletedAt = queryDto.deleted === Deleted.ONLY ? Not(IsNull()) : queryDto.deleted === Deleted.NONE ? IsNull() : Or(IsNull(), Not(IsNull()));

    queryBuilder
      .orderBy("model.createdAt", queryDto.order)
      .skip(queryDto.skip)
      .take(queryDto.take)
      .withDeleted()
      .where({ deletedAt })
      .leftJoin("model.featuredImage", "featuredImage")
      .leftJoin("model.gallery", "gallery")
      .leftJoin("model.brand", "brand")
      .leftJoin("model.carType", "carType")
      .andWhere(new Brackets(qb => {
        queryDto.search && qb.andWhere('LOWER(model.name) LIKE LOWER(:search)', { search: queryDto.search });
      }))

    applySelectColumns(queryBuilder, modelsColumnsConfig, 'model');

    return paginatedData(queryDto, queryBuilder);
  }

  async findOne(slug: string) {
    const existingModel = await this.modelsRepo.findOne({
      where: { slug },
      relations: {
        featuredImage: true,
        reviews: {
          user: {
            account: true
          }
        },
        gallery: true,
        brand: {
          logo: true
        },
        carType: true
      },
      select: modelColumnsConfig
    });
    if (!existingModel) throw new NotFoundException('Model not found');
    return existingModel;
  }

  async update(slug: string, updateModelDto: UpdateModelDto) {
    const existingModel = await this.findOne(slug);

    // check if name or slug is already taken
    if ((updateModelDto.name && existingModel.name !== updateModelDto.name) || (updateModelDto.slug && existingModel.slug !== updateModelDto.slug)) {
      const existingWithSameNameOrSlug = await this.modelsRepo.findOne({
        where: [
          { name: updateModelDto.name },
          { slug: updateModelDto.slug }
        ]
      });
      if (existingWithSameNameOrSlug) throw new ConflictException('Model with same name or slug already exists');
    }

    // Update featuredImage if it's different
    const featuredImage = updateModelDto.featuredImageId && (existingModel.featuredImage.id !== updateModelDto.featuredImageId)
      ? await this.imagesService.findOne(updateModelDto.featuredImageId)
      : existingModel.featuredImage;

    // update brand if it's different
    const brand = updateModelDto.brandSlug && (existingModel.brand.slug !== updateModelDto.brandSlug)
      ? await this.brandsService.findOne(updateModelDto.brandSlug)
      : existingModel.brand;

    // update carType if it's different
    const carType = updateModelDto.carTypeSlug && (existingModel.carType.slug !== updateModelDto.carTypeSlug)
      ? await this.carTypesService.findOne(updateModelDto.carTypeSlug)
      : existingModel.carType;

    Object.assign(existingModel, {
      ...updateModelDto,
      featuredImage,
      brand,
      carType,
    });

    const savedModel = await this.modelsRepo.save(existingModel);

    return this.modelMutationReturn(savedModel, 'update');
  }

  async remove(slug: string) {
    const existingModel = await this.findOne(slug);
    await this.modelsRepo.remove(existingModel);
    return {
      message: 'Model deleted'
    }
  }

  private modelMutationReturn(model: Model, type: 'create' | 'update') {
    return {
      message: type === 'create' ? 'Model created' : 'Model updated',
      model: {
        id: model.id,
        slug: model.slug,
        name: model.name
      }
    }
  }
}

import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { Brand } from './entities/brand.entity';
import { Brackets, IsNull, Not, Or, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ImagesService } from 'src/images/images.service';
import { Deleted, QueryDto } from 'src/core/dto/query.dto';
import paginatedData from 'src/core/utils/paginatedData';

@Injectable()
export class BrandsService {
  constructor(
    @InjectRepository(Brand) private readonly brandRepository: Repository<Brand>,
    private readonly imageService: ImagesService
  ) { }

  async create(createBrandDto: CreateBrandDto) {
    const existingBrand = await this.brandRepository.findOneBy({ name: createBrandDto.name });
    if (existingBrand) throw new ConflictException('Brand already exists');

    const logo = await this.imageService.findOne(createBrandDto.logoId);

    const brand = this.brandRepository.create({
      name: createBrandDto.name,
      logo: logo,
      description: createBrandDto.description,
      website: createBrandDto.website,
    });

    const savedBrand = await this.brandRepository.save(brand);

    return {
      message: 'Brand created',
      brand: {
        id: savedBrand.id,
        name: savedBrand.name,
        slug: savedBrand.slug,
      }
    }
  }

  async findAll(queryDto: QueryDto) {
    const queryBuilder = this.brandRepository.createQueryBuilder('brand');
    const deletedAt = queryDto.deleted === Deleted.ONLY ? Not(IsNull()) : queryDto.deleted === Deleted.NONE ? IsNull() : Or(IsNull(), Not(IsNull()));

    queryBuilder
      .orderBy("brand.createdAt", queryDto.order)
      .skip(queryDto.skip)
      .take(queryDto.take)
      .withDeleted()
      .where({ deletedAt })
      .leftJoin("brand.logo", "logo")
      .andWhere(new Brackets(qb => {
        queryDto.search && qb.andWhere('brand.name = :brandName', { brandName: queryDto.search });
      }))
      .select([
        'brand.id', 'brand.name', 'brand.description', 'brand.website', 'logo.id', 'logo.url', 'brand.createdAt', 'brand.slug',
      ])

    return paginatedData(queryDto, queryBuilder);
  }

  async findOne(id: string) {
    const existingBrand = await this.brandRepository.findOne({
      where: { id },
      relations: {
        logo: true,
      },
      select: {
        logo: {
          url: true,
          id: true,
        }
      }
    });
    if (!existingBrand) throw new NotFoundException('Brand not found');

    return existingBrand;
  }

  async update(id: string, updateBrandDto: UpdateBrandDto) {
    const existingBrand = await this.findOne(id);

    const logo = updateBrandDto.logoId && (existingBrand.logo.id !== updateBrandDto.logoId)
      ? await this.imageService.findOne(updateBrandDto.logoId)
      : null;

    Object.assign(existingBrand, {
      ...updateBrandDto,
      logo: logo,
    });

    const savedBrand = await this.brandRepository.save(existingBrand);

    return {
      message: 'Brand updated',
      brand: {
        id: savedBrand.id,
        name: savedBrand.name,
      }
    }
  }

  async remove(id: string) {
    const existingBrand = await this.findOne(id);
    await this.brandRepository.remove(existingBrand);

    return {
      message: 'Brand removed',
    }
  }
}

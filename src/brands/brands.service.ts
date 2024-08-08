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
    const existingBrand = await this.brandRepository.findOne({
      where: [
        { name: createBrandDto.name },
        { slug: createBrandDto.slug }
      ]
    });
    if (existingBrand) throw new ConflictException('Brand with that name or slug already exists');

    const logo = await this.imageService.findOne(createBrandDto.logoId);

    const brand = this.brandRepository.create({
      name: createBrandDto.name,
      logo: logo,
      description: createBrandDto.description,
      website: createBrandDto.website,
    });

    const savedBrand = await this.brandRepository.save(brand);

    return this.brandMutationReturn(savedBrand, 'create');
  }

  async findAll(queryDto: QueryDto) {
    const queryBuilder = this.brandRepository.createQueryBuilder('brand');
    const deletedAt = queryDto.deleted === Deleted.ONLY ? Not(IsNull()) : queryDto.deleted === Deleted.NONE ? IsNull() : Or(IsNull(), Not(IsNull()));

    queryBuilder
      .orderBy("brand.createdAt", queryDto.order)
      .skip(queryDto.skipPagination === 'true' ? undefined : queryDto.skip)
      .take(queryDto.skipPagination === 'true' ? undefined : queryDto.take)
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

  async findOne(slug: string) {
    const existingBrand = await this.brandRepository.findOne({
      where: { slug },
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

  async update(slug: string, updateBrandDto: UpdateBrandDto) {
    const existingBrand = await this.findOne(slug);

    // check if name or slug is already taken
    if (existingBrand.name !== updateBrandDto.name || existingBrand.slug !== updateBrandDto.slug) {
      const existingWithSameNameOrSlug = await this.brandRepository.findOne({
        where: [
          { name: updateBrandDto.name },
          { slug: updateBrandDto.slug }
        ]
      });
      if (existingWithSameNameOrSlug && existingWithSameNameOrSlug.id !== existingBrand.id) throw new ConflictException('Brand with that name or slug already exists');
    }

    // Update logo if it's different
    const logo = updateBrandDto.logoId && (existingBrand.logo.id !== updateBrandDto.logoId)
      ? await this.imageService.findOne(updateBrandDto.logoId)
      : existingBrand.logo;

    Object.assign(existingBrand, {
      ...updateBrandDto,
      logo: logo,
    });

    const savedBrand = await this.brandRepository.save(existingBrand);

    return this.brandMutationReturn(savedBrand, 'update');
  }

  async remove(slug: string) {
    const existingBrand = await this.findOne(slug);
    await this.brandRepository.remove(existingBrand);

    return {
      message: 'Brand removed',
    }
  }

  private brandMutationReturn(brand: Brand, type: 'create' | 'update') {
    return {
      message: `${type === 'create' ? 'Brand created' : 'Brand updated'}`,
      brand: {
        id: brand.id,
        name: brand.name,
        slug: brand.slug,
      }
    }
  }
}

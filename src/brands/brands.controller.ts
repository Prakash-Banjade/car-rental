import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { BrandsService } from './brands.service';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { QueryDto } from 'src/core/dto/query.dto';
import { ChekcAbilities } from 'src/core/decorators/abilities.decorator';
import { Action } from 'src/core/types/global.types';
import { Public } from 'src/core/decorators/setPublicRoute.decorator';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('Brands')
@Controller('brands')
export class BrandsController {
  constructor(private readonly brandsService: BrandsService) { }

  @ApiBearerAuth()
  @Post()
  @ChekcAbilities({ subject: 'all', action: Action.CREATE })
  create(@Body() createBrandDto: CreateBrandDto) {
    return this.brandsService.create(createBrandDto);
  }

  @Public()
  @Get()
  findAll(@Query() queryDto: QueryDto) {
    return this.brandsService.findAll(queryDto);
  }

  @Public()
  @Get(':slug')
  findOne(@Param('slug') slug: string) {
    return this.brandsService.findOne(slug);
  }

  @ApiBearerAuth()
  @Patch(':slug')
  @ChekcAbilities({ subject: 'all', action: Action.UPDATE })
  update(@Param('slug') slug: string, @Body() updateBrandDto: UpdateBrandDto) {
    return this.brandsService.update(slug, updateBrandDto);
  }

  @ApiBearerAuth()
  @Delete(':slug')
  @ChekcAbilities({ subject: 'all', action: Action.DELETE })
  remove(@Param('slug') slug: string) {
    return this.brandsService.remove(slug);
  }
}

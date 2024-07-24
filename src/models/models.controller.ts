import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ModelsService } from './models.service';
import { CreateModelDto } from './dto/create-model.dto';
import { UpdateModelDto } from './dto/update-model.dto';
import { ModelQueryDto } from './dto/model-query.dto';
import { Public } from 'src/core/decorators/setPublicRoute.decorator';
import { ChekcAbilities } from 'src/core/decorators/abilities.decorator';
import { Action } from 'src/core/types/global.types';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('Models')
@Controller('models')
export class ModelsController {
  constructor(private readonly modelsService: ModelsService) { }

  @Post()
  @ApiBearerAuth()
  @ChekcAbilities({ action: Action.CREATE, subject: 'all' })
  create(@Body() createModelDto: CreateModelDto) {
    return this.modelsService.create(createModelDto);
  }

  @Public()
  @Get()
  findAll(@Query() queryDto: ModelQueryDto) {
    return this.modelsService.findAll(queryDto);
  }

  @Public()
  @Get(':slug')
  findOne(@Param('slug') slug: string) {
    return this.modelsService.findOne(slug);
  }

  @Patch(':slug')
  @ApiBearerAuth()
  // @ChekcAbilities({ action: Action.UPDATE, subject: 'all' })
  update(@Param('slug') slug: string, @Body() updateModelDto: UpdateModelDto) {
    return this.modelsService.update(slug, updateModelDto);
  }

  @Delete(':slug')
  @ApiBearerAuth()
  @ChekcAbilities({ action: Action.DELETE, subject: 'all' })
  remove(@Param('slug') slug: string) {
    return this.modelsService.remove(slug);
  }
}

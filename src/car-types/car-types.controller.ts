import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { QueryDto } from 'src/core/dto/query.dto';
import { ChekcAbilities } from 'src/core/decorators/abilities.decorator';
import { Action } from 'src/core/types/global.types';
import { Public } from 'src/core/decorators/setPublicRoute.decorator';
import { CarTypesService } from './car-types.service';
import { CreateCarTypeDto } from './dto/create-car-type.dto';
import { UpdateCarTypeDto } from './dto/update-car-type.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('Car Types')
@Controller('car-types')
export class CarTypesController {
  constructor(private readonly carTypesService: CarTypesService) { }

  @ApiBearerAuth()
  @Post()
  @ChekcAbilities({ subject: 'all', action: Action.CREATE })
  create(@Body() createCarTypeDto: CreateCarTypeDto) {
    return this.carTypesService.create(createCarTypeDto);
  }

  @Public()
  @Get()
  findAll(@Query() queryDto: QueryDto) {
    return this.carTypesService.findAll(queryDto);
  }

  @Public()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.carTypesService.findOne(id);
  }

  @ApiBearerAuth()
  @Patch(':id')
  @ChekcAbilities({ subject: 'all', action: Action.UPDATE })
  update(@Param('id') id: string, @Body() updateCarTypeDto: UpdateCarTypeDto) {
    return this.carTypesService.update(id, updateCarTypeDto);
  }

  @ApiBearerAuth()
  @Delete(':id')
  @ChekcAbilities({ subject: 'all', action: Action.DELETE })
  remove(@Param('id') id: string) {
    return this.carTypesService.remove(id);
  }
}

import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseInterceptors } from '@nestjs/common';
import { RentalsService } from './rentals.service';
import { CreateRentalDto } from './dto/create-rental.dto';
import { UpdateRentalDto } from './dto/update-rental.dto';
import { RentalQueryDto } from './dto/rental-query.dto';
import { CurrentUser } from 'src/core/decorators/user.decorator';
import { Action, AuthUser } from 'src/core/types/global.types';
import { TransactionInterceptor } from 'src/core/interceptors/transaction.interceptor';
import { ApiPaginatedResponse } from 'src/core/decorators/apiPaginatedResponse.decorator';
import { ChekcAbilities } from 'src/core/decorators/abilities.decorator';
import { User } from 'src/users/entities/user.entity';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiBearerAuth()
@ApiTags('Rentals')
@Controller('rentals')
export class RentalsController {
  constructor(private readonly rentalsService: RentalsService) { }

  @Post()
  @UseInterceptors(TransactionInterceptor)
  create(@Body() createRentalDto: CreateRentalDto, @CurrentUser() currentUser: AuthUser) {
    return this.rentalsService.create(createRentalDto, currentUser);
  }

  @Get()
  @ApiPaginatedResponse(CreateRentalDto)
  findAll(@Query() queryDto: RentalQueryDto, @CurrentUser() currentUser: AuthUser) {
    return this.rentalsService.findAll(queryDto, currentUser);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @CurrentUser() currentUser: AuthUser) {
    return this.rentalsService.findOne(id, currentUser);
  }

  @Patch(':id/cancel')
  @UseInterceptors(TransactionInterceptor)
  @ChekcAbilities({ action: Action.UPDATE, subject: User })
  cancelMyOrder(@Param('id') id: string, @CurrentUser() currentUser: AuthUser) {
    return this.rentalsService.cancelRental(id, currentUser);
  }

  @Patch(':id')
  @ChekcAbilities({ action: Action.UPDATE, subject: 'all' })
  @UseInterceptors(TransactionInterceptor)
  update(@Param('id') id: string, @Body() updateRentalDto: UpdateRentalDto) {
    return this.rentalsService.updateRental(id, updateRentalDto);
  }
}

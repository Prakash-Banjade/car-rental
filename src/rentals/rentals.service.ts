import { BadRequestException, Inject, Injectable, NotFoundException, Scope } from '@nestjs/common';
import { CreateRentalDto } from './dto/create-rental.dto';
import { UpdateRentalDto } from './dto/update-rental.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Rental } from './entities/rental.entity';
import { Brackets, DataSource, IsNull, Not, Or, Repository } from 'typeorm';
import { REQUEST } from '@nestjs/core';
import { query, Request } from 'express';
import { BaseRepository } from 'src/core/repository/base.repository';
import { Model } from 'src/models/entities/model.entity';
import { AuthUser, ERentalStatus, Roles } from 'src/core/types/global.types';
import { User } from 'src/users/entities/user.entity';
import { Deleted, QueryDto } from 'src/core/dto/query.dto';
import { RentalQueryDto } from './dto/rental-query.dto';
import paginatedData from 'src/core/utils/paginatedData';
import { rentalSelectColsConfig } from './entities/rental-select-cols.config';
import { applySelectColumns } from 'src/core/utils/apply-select-cols';
import { PaymentsService } from 'src/payments/payments.service';

@Injectable({ scope: Scope.REQUEST })
export class RentalsService extends BaseRepository {
  constructor(
    dataSource: DataSource, @Inject(REQUEST) req: Request,
    private readonly paymentService: PaymentsService,
  ) {
    super(dataSource, req);
  }

  async create(createRentalDto: CreateRentalDto, currentUser: AuthUser) {
    const model = await this.getRepository<Model>(Model).findOneBy({ slug: createRentalDto.modelSlug });
    if (model.status !== 'available') throw new BadRequestException('Model is not available');

    const user = await this.getRepository<User>(User).findOneBy({ id: currentUser.userId });

    const newRental = this.getRepository<Rental>(Rental).create({
      ...createRentalDto,
      user,
      model
    })

    const savedRental = await this.getRepository<Rental>(Rental).save(newRental);

    const paymentResult = await this.paymentService.create(savedRental, createRentalDto.paymentMethod);

    return {
      message: 'Rental created successfully',
      rental: {
        id: savedRental.id,
        totalAmount: savedRental.totalAmount,
        model: savedRental.model.name,
      },
      payment: paymentResult
    }

  }

  async findAll(queryDto: RentalQueryDto) {
    const queryBuilder = this.getRepository<Rental>(Rental).createQueryBuilder('rental');
    const deletedAt = queryDto.deleted === Deleted.ONLY ? Not(IsNull()) : queryDto.deleted === Deleted.NONE ? IsNull() : Or(IsNull(), Not(IsNull()));

    queryBuilder
      .orderBy("rental.createdAt", queryDto.order)
      .skip(queryDto.skip)
      .take(queryDto.take)
      .withDeleted()
      .where({ deletedAt })
      .leftJoin("rental.model", "model")
      .leftJoin("rental.user", "user")
      .leftJoin("user", "user.account")
      .leftJoin("model.brand", "brand")
      .leftJoin("model.featuredImage", "featuredImage")
      .andWhere(new Brackets(qb => {
        // queryDto.search && qb.andWhere('LOWER(rental.name) LIKE LOWER(:search)', { search: queryDto.search });
      }))

    applySelectColumns(queryBuilder, rentalSelectColsConfig, 'rental')


    return paginatedData(queryDto, queryBuilder);
  }

  async findOne(id: string, currentUser: AuthUser) {
    const userId = currentUser.role === Roles.ADMIN ? undefined : currentUser.userId

    const existing = await this.getRepository<Rental>(Rental).findOne({
      where: [
        { id, user: { id: userId } },
        { rentalId: id, user: { id: userId } }
      ],
      relations: { model: { featuredImage: true, brand: true }, user: { account: true } },
      select: rentalSelectColsConfig,
    });

    if (!existing) throw new NotFoundException('Rental not found')

    return existing;
  }

  async cancelRental(id: string, currentUser: AuthUser) {
    const existing = await this.findOne(id, currentUser);

    if (existing.status === ERentalStatus.CANCELLED) throw new BadRequestException('Rental is already cancelled');
    if (existing.status === ERentalStatus.RETURNED) throw new BadRequestException('Rental is already completed');

    const now = Date.now();
    const rentalTime = new Date(existing.startDate).getTime()

    if (now <= rentalTime) throw new BadRequestException('Rental cannot be cancelled at this stage')

    existing.status = ERentalStatus.CANCELLED;
    existing.cancelledAt = new Date().toISOString();

    const savedRentalawait = await this.getRepository<Rental>(Rental).save(existing);

    return {
      message: 'Rental cancelled successfully',
      rental: {
        id: savedRentalawait.id
      }
    }
  }

  async update(id: string, updateRentalDto: UpdateRentalDto) {
    const existing = await this.getRepository<Rental>(Rental).findOne({
      where: { id },
    })
    if (!existing) throw new NotFoundException('Rental not found')

    if (existing.status === ERentalStatus.CANCELLED) throw new BadRequestException('Rental is already cancelled');
    if (existing.status === ERentalStatus.RETURNED) throw new BadRequestException('Rental is already completed');

    const now = Date.now();
    const rentalTime = new Date(existing.startDate).getTime()

    if (now <= rentalTime) throw new BadRequestException('Rental cannot be cancelled at this stage')

    existing.status = ERentalStatus.CANCELLED;
    existing.cancelledAt = new Date().toISOString();

    const savedRental = await this.getRepository<Rental>(Rental).save(existing);

    return {
      message: 'Rental cancelled successfully',
      rental: {
        id: savedRental.id
      }
    }
  }
}

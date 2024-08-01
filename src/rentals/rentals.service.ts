import { BadRequestException, Inject, Injectable, NotFoundException, Scope } from '@nestjs/common';
import { CreateRentalDto } from './dto/create-rental.dto';
import { UpdateRentalDto } from './dto/update-rental.dto';
import { Rental } from './entities/rental.entity';
import { Brackets, DataSource, Equal } from 'typeorm';
import { REQUEST } from '@nestjs/core';
import { query, Request } from 'express';
import { BaseRepository } from 'src/core/repository/base.repository';
import { Model } from 'src/models/entities/model.entity';
import { AuthUser, EModelStatus, ERentalStatus, PaymentStatus, Roles } from 'src/core/types/global.types';
import { User } from 'src/users/entities/user.entity';
import { Deleted } from 'src/core/dto/query.dto';
import { RentalQueryDto } from './dto/rental-query.dto';
import paginatedData from 'src/core/utils/paginatedData';
import { rentalSelectColsConfig } from './entities/rental-select-cols.config';
import { applySelectColumns } from 'src/core/utils/apply-select-cols';
import { PaymentsService } from 'src/payments/payments.service';
import { CreateRentalItemsDto } from './dto/createRentalItems.dto';
import { RentalItem } from './entities/rental-items.entity';
import { Payment } from 'src/payments/entities/payment.entity';
import { UpdateRentalItemDto } from './dto/updateRentalItem.dto';

@Injectable({ scope: Scope.REQUEST })
export class RentalsService extends BaseRepository {
  constructor(
    dataSource: DataSource, @Inject(REQUEST) req: Request,
    private readonly paymentService: PaymentsService,
  ) {
    super(dataSource, req);
  }

  async create(createRentalDto: CreateRentalDto, currentUser: AuthUser) {
    const user = await this.getRepository<User>(User).findOneBy({ id: currentUser.userId });

    const newRental = this.getRepository<Rental>(Rental).create({
      user,
    })

    const savedRental = await this.getRepository<Rental>(Rental).save(newRental);

    // CREATE RENTAL ITEMS
    let totalAmount = 0;
    for (const item of createRentalDto.rentalItems) {
      const savedRentalItems = await this.createRentalItems(item, savedRental);
      totalAmount += savedRentalItems.totalAmount;
    }

    // ADD TOTAL AMOUNT TO RENTAL
    savedRental.totalAmount = totalAmount;
    await this.getRepository<Rental>(Rental).save(savedRental);

    const paymentResult = await this.paymentService.create(savedRental, createRentalDto.paymentMethod);

    return {
      message: 'Rental created successfully',
      rental: {
        id: savedRental.id,
        totalAmount: savedRental.totalAmount,
      },
      payment: paymentResult
    }

  }

  async createRentalItems(createRentalItemsDto: CreateRentalItemsDto, rental: Rental) {
    const model = await this.getRepository<Model>(Model).findOneBy({ slug: createRentalItemsDto.modelSlug });

    // CHECK IF RENTAL IS ALREADY CREATED FOR THE MODEL
    const lastRentalForTheModel = await this.getRepository<RentalItem>(RentalItem)
      .createQueryBuilder('rentalItem')
      .leftJoinAndSelect('rentalItem.model', 'model')
      .where('model.slug = :modelSlug', { modelSlug: createRentalItemsDto.modelSlug })
      .orderBy('rentalItem.createdAt', 'DESC')
      .limit(1)
      .getOne();

    // CHECK IF MODEL IS AVAILABLE
    if (model.status === EModelStatus.BOOKED) {
      const willBeAvailableOn = new Date(lastRentalForTheModel.endDate).toDateString();

      throw new BadRequestException(`${model.name} is not available yet. It will be available on ${willBeAvailableOn}`);
    } else if (model.status === EModelStatus.MAINTENANCE) {
      throw new BadRequestException(`${model.name} is in maintenance mode`);
    }

    const newRentalItems = this.getRepository<RentalItem>(RentalItem).create({
      ...createRentalItemsDto,
      rental,
      model
    })

    const savedRentalItem = await this.getRepository<RentalItem>(RentalItem).save(newRentalItems);

    // CHANGE MODEL STATUS
    model.status = EModelStatus.BOOKED;
    await this.getRepository<Model>(Model).save(model);

    return savedRentalItem;
  }

  async findAll(queryDto: RentalQueryDto, currentUser: AuthUser) {
    const queryBuilder = this.getRepository<Rental>(Rental).createQueryBuilder('rental');

    let startDate = new Date(new Date().setHours(0, 0, 0, 0)).toISOString(), endDate = new Date().toISOString();
    const adjustedEndDate = new Date(new Date(endDate).setDate(new Date(endDate).getDate() + 1));

    const deletedAtCondition = queryDto.deleted === Deleted.ONLY
      ? 'rental.deletedAt IS NOT NULL'
      : queryDto.deleted === Deleted.NONE
        ? 'rental.deletedAt IS NULL'
        : '1=1'; // Default condition to match all

    queryBuilder
      .orderBy("rental.createdAt", queryDto.order)
      .skip(queryDto.skip)
      .take(queryDto.take)
      .withDeleted()
      .where(deletedAtCondition)
      .leftJoin("rental.rentalItems", "rentalItems")
      .leftJoin("rentalItems.model", "model")
      .leftJoin("rental.user", "user")
      .leftJoin("user.account", "account")
      .leftJoin("model.brand", "brand")
      .leftJoin("model.featuredImage", "featuredImage")
      .leftJoin("rental.payment", "payment")
      .andWhere(new Brackets(qb => {
        if (currentUser.role === Roles.USER) {
          qb.andWhere("user.id = :userId", { userId: currentUser.userId });
        }
        queryDto.rentalId && qb.andWhere({ rentalId: Equal(queryDto.rentalId) });
      }))

    applySelectColumns(queryBuilder, rentalSelectColsConfig, 'rental')

    if (queryDto.recent === 'true') {
      queryBuilder.andWhere('rental.createdAt BETWEEN :startDate AND :endDate', { startDate, endDate: adjustedEndDate })
    }

    return paginatedData(queryDto, queryBuilder);
  }

  async findOne(id: string, currentUser: AuthUser) {
    const userId = currentUser.role === Roles.ADMIN ? undefined : currentUser.userId

    const existing = await this.getRepository<Rental>(Rental).findOne({
      where: [
        { id, user: { id: userId } },
        { rentalId: id, user: { id: userId } }
      ],
      relations: {
        user: { account: true },
        rentalItems: {
          model: {
            featuredImage: true,
            brand: true
          },
        }
      },
      select: rentalSelectColsConfig,
    });

    if (!existing) throw new NotFoundException('Rental not found')

    return existing;
  }

  async cancelRental(id: string, currentUser: AuthUser) {
    const existing = await this.findOne(id, currentUser);

    if (existing.status === ERentalStatus.CANCELLED) throw new BadRequestException('Rental is already cancelled');
    if (existing.status === ERentalStatus.RETURNED) throw new BadRequestException('Rental is already completed');

    // const now = Date.now();
    // const rentalTime = new Date(existing.startDate).getTime()

    // if (now <= rentalTime) throw new BadRequestException('Rental cannot be cancelled at this stage')

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

  async updateRental(id: string, updateRentalDto: UpdateRentalDto) {
    const existing = await this.getRepository<Rental>(Rental).findOne({
      where: { id },
      relations: { payment: true }
    })
    if (!existing) throw new NotFoundException('Rental not found')

    if (existing.status === ERentalStatus.CANCELLED) throw new BadRequestException('Rental is already cancelled');
    if (existing.status === ERentalStatus.RETURNED) throw new BadRequestException('Rental is already completed');


    // const now = Date.now();
    // const rentalTime = new Date(existing.startDate).getTime()

    // if (now <= rentalTime) throw new BadRequestException('Rental cannot be cancelled at this stage')

    existing.status = updateRentalDto.status;

    if (updateRentalDto.status === ERentalStatus.CANCELLED) { // rental is cancelled
      existing.cancelledAt = new Date().toISOString();
    } else if (updateRentalDto.status === ERentalStatus.RETURNED) { // rental is successfully completed, car is returned;
      const payment = await this.paymentService.findOne(existing.payment.id);
      payment.status = PaymentStatus.COMPLETED;

      await this.getRepository<Payment>(Payment).save(payment);
    }

    const savedRental = await this.getRepository<Rental>(Rental).save(existing);

    return {
      message: 'Rental cancelled successfully',
      rental: {
        id: savedRental.id
      }
    }
  }

  async updateRentalItems(id: string, updateRentalItemsDto: UpdateRentalItemDto, currentUser: AuthUser) {
    const userId = currentUser.role === Roles.ADMIN ? undefined : currentUser.userId

    const existing = await this.getRepository<RentalItem>(RentalItem).findOne({
      where: { id, rental: { user: { id: userId } } },
      relations: { model: true }
    })

    existing.status = updateRentalItemsDto.status;

    if (updateRentalItemsDto.status === ERentalStatus.RETURNED) {
      existing.model.status = EModelStatus.AVAILABLE;
      await this.getRepository<Model>(Model).save(existing.model);
    }

    const savedRentalItems = await this.getRepository<RentalItem>(RentalItem).save(existing);

    return savedRentalItems;

  }
}

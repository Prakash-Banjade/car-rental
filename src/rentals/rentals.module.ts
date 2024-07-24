import { Module } from '@nestjs/common';
import { RentalsService } from './rentals.service';
import { RentalsController } from './rentals.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Rental } from './entities/rental.entity';
import { PaymentsModule } from 'src/payments/payments.module';
import { RentalItem } from './entities/rental-items.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Rental,
      RentalItem,
    ]),
    PaymentsModule,
  ],
  controllers: [RentalsController],
  providers: [RentalsService],
})
export class RentalsModule { }

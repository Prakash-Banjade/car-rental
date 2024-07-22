import { Module } from '@nestjs/common';
import { RentalsService } from './rentals.service';
import { RentalsController } from './rentals.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Rental } from './entities/rental.entity';
import { PaymentsModule } from 'src/payments/payments.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Rental
    ]),
    PaymentsModule,
  ],
  controllers: [RentalsController],
  providers: [RentalsService],
})
export class RentalsModule { }

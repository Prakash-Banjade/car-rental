import { Module } from '@nestjs/common';
import { CarTypesService } from './car-types.service';
import { CarTypesController } from './car-types.controller';
import { CarType } from './entities/car-type.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ImagesModule } from 'src/images/images.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([CarType]),
    ImagesModule,
  ],
  controllers: [CarTypesController],
  providers: [CarTypesService],
  exports: [CarTypesService],
})
export class CarTypesModule { }

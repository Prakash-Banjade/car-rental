import { Module } from '@nestjs/common';
import { ModelsService } from './models.service';
import { ModelsController } from './models.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Model } from './entities/model.entity';
import { ImagesModule } from 'src/images/images.module';
import { CarTypesModule } from 'src/car-types/car-types.module';
import { BrandsModule } from 'src/brands/brands.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Model,
    ]),
    ImagesModule,
    CarTypesModule,
    BrandsModule,
  ],
  controllers: [ModelsController],
  providers: [ModelsService],
  exports: [ModelsService],
})
export class ModelsModule { }

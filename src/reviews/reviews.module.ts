import { Module } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { ReviewsController } from './reviews.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Review } from './entities/review.entity';
import { ReviewsRepository } from './review.repository';
import { Model } from 'src/models/entities/model.entity';
import { UsersModule } from 'src/users/users.module';
import { ModelsModule } from 'src/models/models.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Review,
      Model,
    ]),
    UsersModule,
    ModelsModule,
  ],
  controllers: [ReviewsController],
  providers: [ReviewsService, ReviewsRepository],
})
export class ReviewsModule { }

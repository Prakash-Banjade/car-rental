import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Review } from './entities/review.entity';
import { Between, Brackets, ILike, IsNull, Not, Or, Repository } from 'typeorm';
import { UsersService } from 'src/users/users.service';
import { AuthUser } from 'src/core/types/global.types';
import { Deleted } from 'src/core/dto/query.dto';
import paginatedData from 'src/core/utils/paginatedData';
import { ReviewQueryDto } from './entities/review-query.dto';
import { Model } from 'src/models/entities/model.entity';
import { ModelsService } from 'src/models/models.service';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(Review) private readonly reviewsRepo: Repository<Review>,
    @InjectRepository(Model) private readonly modelsRepo: Repository<Model>,
    private readonly usersService: UsersService,
    private readonly modelsService: ModelsService,
  ) { }

  async create(createReviewDto: CreateReviewDto, currentUser: AuthUser) {
    const user = await this.usersService.findOne(currentUser.userId);
    const model = await this.modelsService.findOne(createReviewDto.modelSlug);

    // CHECK IF REVIEW ALREADY EXISTS
    const existingReview = await this.getModelReviewByUser(createReviewDto.modelSlug, currentUser);
    if (existingReview) throw new BadRequestException('Review already exists');

    const review = this.reviewsRepo.create({
      comment: createReviewDto.comment,
      rating: createReviewDto.rating,
      user,
      model,
    });

    const savedReview = await this.reviewsRepo.save(review);

    await this.updateModelAvgRating(model.id);

    return {
      message: "Review added successfully",
      review: {
        id: savedReview.id,
        comment: savedReview.comment,
        rating: savedReview.rating,
      }
    }
  }

  private async updateModelAvgRating(modelId: string) {
    const model = await this.modelsRepo.findOne({
      where: { id: modelId },
      relations: { reviews: true },
    });
    if (!model) throw new InternalServerErrorException('Model not found');

    const totalReviews = model.reviews.length;
    const sumRatings = model.reviews.reduce((sum, review) => sum + review.rating, 0);
    const avgRating = totalReviews > 0 ? sumRatings / totalReviews : 0;

    model.rating = parseFloat(avgRating.toFixed(2));
    await this.modelsRepo.save(model);
  }

  async getModelReviewByUser(modelSlug: string, currentUser: AuthUser) {
    const review = await this.reviewsRepo.findOne({
      where: { user: { id: currentUser.userId }, model: { slug: modelSlug } },
    });
    return review
  }

  async findAll(queryDto: ReviewQueryDto, currentUser: AuthUser) {
    const queryBuilder = this.reviewsRepo.createQueryBuilder('reivew');
    const deletedAt = queryDto.deleted === Deleted.ONLY ? Not(IsNull()) : queryDto.deleted === Deleted.NONE ? IsNull() : Or(IsNull(), Not(IsNull()));

    queryBuilder
      .orderBy("reivew.createdAt", queryDto.order)
      .skip(queryDto.search ? undefined : queryDto.skip)
      .take(queryDto.search ? undefined : queryDto.take)
      .leftJoinAndSelect("reivew.user", "user")
      .leftJoinAndSelect("reivew.model", "model")
      .withDeleted()
      .where({ deletedAt })
      .andWhere(new Brackets(qb => {
        queryDto.modelName && qb.andWhere({ modelName: ILike(`%${queryDto.modelName ?? ''}%`) });

        qb.andWhere("user.id = :userId", { userId: currentUser.userId });
        if ((queryDto.ratingFrom && queryDto.ratingTo) && !queryDto.rating && queryDto.ratingFrom < queryDto.ratingTo)
          qb.andWhere({ rating: Between(queryDto.ratingFrom, queryDto.ratingTo) });
        if (queryDto.rating) qb.andWhere({ rating: queryDto.rating });
      }))

    return paginatedData(queryDto, queryBuilder);
  }

  async findOne(id: string, currentUser: AuthUser) {
    const existing = await this.reviewsRepo.findOne({
      where: {
        id,
        user: { id: currentUser.userId },
      },
      relations: { model: true },
    })
    if (!existing) throw new BadRequestException('Review not found')

    return existing
  }

  async update(id: string, updateReviewDto: UpdateReviewDto, currentUser: AuthUser) {
    const existing = await this.findOne(id, currentUser);

    // MODEL IS NOT UPDATED IN REVIEW UPDATE

    if (updateReviewDto.comment) existing.comment = updateReviewDto.comment;
    if (updateReviewDto.rating) existing.rating = updateReviewDto.rating;

    if (updateReviewDto.rating) await this.updateModelAvgRating(existing.model.id);

    const savedReview = await this.reviewsRepo.save(existing);

    return {
      message: "Review updated successfully",
      review: {
        id: savedReview.id,
        comment: savedReview.comment,
        rating: savedReview.rating,
      }
    }

  }

  async remove(id: string, currentUser: AuthUser) {
    const existing = await this.findOne(id, currentUser);
    await this.updateModelAvgRating(existing.model.id);

    return await this.reviewsRepo.remove(existing);
  }
}

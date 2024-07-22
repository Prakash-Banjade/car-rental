import { Inject, Injectable, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { BaseRepository } from 'src/core/repository/base.repository';
import { DataSource } from 'typeorm';
import { Review } from './entities/review.entity';
import { Model } from 'src/models/entities/model.entity';

@Injectable({ scope: Scope.REQUEST })
export class ReviewsRepository extends BaseRepository {
    constructor(dataSource: DataSource, @Inject(REQUEST) req: Request) {
        super(dataSource, req);
    }

    async saveReview(review: Review) {
        return await this.getRepository<Review>(Review).save(review);
    }

    async saveModel(model: Model) {
        return await this.getRepository<Model>(Model).save(model);
    }
}
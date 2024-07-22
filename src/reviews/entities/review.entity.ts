import { BaseEntity } from "src/core/entities/base.entity";
import { Model } from "src/models/entities/model.entity";
import { User } from "src/users/entities/user.entity";
import { Column, Entity, ManyToOne } from "typeorm";

@Entity()
export class Review extends BaseEntity {
    @ManyToOne(() => User, (user) => user.reviews, { onDelete: 'CASCADE' })
    user: User

    @Column({ type: 'real', default: 0 })
    rating: number;

    @Column({ type: 'longtext', nullable: true })
    comment?: string

    @ManyToOne(() => Model, (model) => model.reviews, { onDelete: 'CASCADE' })
    model: Model
}

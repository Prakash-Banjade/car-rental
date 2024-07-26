import { Account } from "src/accounts/entities/account.entity";
import { BaseEntity } from "src/core/entities/base.entity";
import { Model } from "src/models/entities/model.entity";
import { Column, Entity, ManyToOne } from "typeorm";

@Entity()
export class Image extends BaseEntity {
    @Column({ type: 'varchar' })
    url!: string

    @Column({ type: 'varchar' })
    memeType!: string

    @Column({ type: 'int' })
    size!: number

    @Column({ type: 'varchar', default: '' })
    name!: string

    @ManyToOne(() => Account, account => account.images, { onDelete: 'CASCADE' })
    uploadedBy!: Account

    // RELATIONS

    @ManyToOne(() => Model, (model) => model.gallery, { onDelete: 'CASCADE' })
    model: Model
}

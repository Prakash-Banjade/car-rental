import { BaseEntity } from "src/core/entities/base.entity";
import { generateSlug } from "src/core/utils/generateSlug";
import { Image } from "src/images/entities/image.entity";
import { Model } from "src/models/entities/model.entity";
import { BeforeInsert, BeforeUpdate, Column, Entity, JoinColumn, OneToMany, OneToOne } from "typeorm";

@Entity()
export class Brand extends BaseEntity {
    @Column({ type: 'varchar', length: 255 })
    name: string;

    @Column({ type: 'text', })
    slug: string;

    @BeforeInsert()
    @BeforeUpdate()
    generateSlug() {
        if (!this.slug && this.name) this.slug = generateSlug(this.name, false);
    }

    @OneToOne(() => Image)
    @JoinColumn({ name: 'logo' })
    logo: Image;

    @Column({ type: 'longtext' })
    description: string;

    @Column({ type: 'varchar', default: '' })
    website: string;

    @OneToMany(() => Model, (model) => model.brand)
    models: Model[]
}

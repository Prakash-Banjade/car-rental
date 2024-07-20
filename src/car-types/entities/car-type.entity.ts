import { BaseEntity } from "src/core/entities/base.entity";
import { generateSlug } from "src/core/utils/generateSlug";
import { Image } from "src/images/entities/image.entity";
import { BeforeInsert, BeforeUpdate, Column, Entity, JoinColumn, OneToOne } from "typeorm";

@Entity()
export class CarType extends BaseEntity {
    @Column({ type: 'varchar', length: 255 })
    name: string;

    @Column({ type: 'varchar' })
    slug: string;

    @BeforeInsert()
    @BeforeUpdate()
    generateSlug() {
        if (!this.slug && this.name) this.slug = generateSlug(this.name, false);
    }

    @Column({ type: 'longtext' })
    description: string;

    @OneToOne(() => Image)
    @JoinColumn({ name: 'image' })
    image: Image
}

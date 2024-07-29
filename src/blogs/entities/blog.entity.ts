import { BaseEntity } from "src/core/entities/base.entity";
import { generateSlug } from "src/core/utils/generateSlug";
import { Image } from "src/images/entities/image.entity";
import { BeforeInsert, BeforeUpdate, Column, Entity, JoinColumn, OneToOne } from "typeorm";

@Entity()
export class Blog extends BaseEntity {
    @Column({ type: 'text' })
    title: string;

    @Column({ type: 'text' })
    slug: string;

    @BeforeInsert()
    @BeforeUpdate()
    generateSlug() {
        if (!this.slug && this.title) this.slug = generateSlug(this.title);
    }

    @Column({ type: 'longtext', nullable: true })
    summary: string;

    @Column({ type: 'longtext' })
    content: string;

    @OneToOne(() => Image)
    @JoinColumn({ name: 'featured_image_id' })
    featuredImage: Image;

    @OneToOne(() => Image, { nullable: true })
    @JoinColumn({ name: 'cover_image_id' })
    coverImage: Image;

    @Column({ type: 'varchar' })
    author: string;
}

import { BaseEntity } from "src/core/entities/base.entity";
import { Image } from "src/images/entities/image.entity";
import { Column, Entity, JoinColumn, OneToOne } from "typeorm";

@Entity()
export class SeoSetting extends BaseEntity {
    @Column({ type: 'varchar', length: 255, default: '' })
    metaTitle: string;

    @Column({ type: 'longtext' })
    metaTags: string;

    @Column({ type: 'longtext' })
    metaDescription: string;

    @Column({ type: 'varchar', default: '' })
    canonicalUrl: string;

    @Column({ type: 'varchar', length: 255, default: '' })
    ogTitle: string;

    @Column({ type: 'longtext' })
    ogDescription: string;

    @OneToOne(() => Image, { nullable: true })
    @JoinColumn({ name: 'ogImage' })
    ogImage: Image;

    @Column({ type: 'varchar', default: '' })
    twitterUsername: string;
}

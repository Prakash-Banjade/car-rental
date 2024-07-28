import { BaseEntity } from "src/core/entities/base.entity";
import { Image } from "src/images/entities/image.entity";
import { Column, Entity, JoinColumn, OneToOne } from "typeorm";

@Entity()
export class GeneralSetting extends BaseEntity {
    @Column({ type: 'varchar', length: 255, default: '' })
    companyName: string;

    @OneToOne(() => Image)
    @JoinColumn({ name: 'logoId' })
    logo: Image

    @OneToOne(() => Image)
    @JoinColumn({ name: 'collapseLogoId' })
    collapseLogo: Image;

    @Column({ type: 'varchar', length: 255, default: '' })
    siteTitle: string;

    @Column({ type: 'varchar', nullable: true, default: '' })
    siteSubtitle: string;

    @Column({ type: 'longtext', nullable: true })
    footerDescription: string;
}

import { Column, Entity, OneToMany } from "typeorm";
import { Image } from "./image.entity";
import { BaseEntity } from "src/core/entities/base.entity";

@Entity()
export class ImageGallery extends BaseEntity {

    @OneToMany(() => Image, image => image.imageGallery)
    images: Image[];

    @Column({ type: 'varchar', default: '' })
    name!: string
}
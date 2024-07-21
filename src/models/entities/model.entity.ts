import { Brand } from "src/brands/entities/brand.entity";
import { CarType } from "src/car-types/entities/car-type.entity";
import { BaseEntity } from "src/core/entities/base.entity";
import { EFuelType, EGearBox, EModelStatus } from "src/core/types/global.types";
import { generateSlug } from "src/core/utils/generateSlug";
import { ImageGallery } from "src/images/entities/image-gallery.entity";
import { Image } from "src/images/entities/image.entity";
import { BeforeInsert, BeforeUpdate, Column, Entity, JoinColumn, ManyToOne, OneToOne } from "typeorm";

@Entity()
export class Model extends BaseEntity {
    @Column({ type: 'varchar' })
    name: string;

    @Column({ type: 'varchar' })
    slug: string;

    @BeforeInsert()
    @BeforeUpdate()
    generateSlug() {
        if (!this.slug && this.name) this.slug = generateSlug(this.name, false);
    }

    @Column({ type: 'longtext', nullable: true })
    description?: string;

    @Column({ type: 'varchar', length: 50 })
    licensePlate: string;

    @Column({ type: 'varchar', length: 255 })
    vin: string;

    @Column({ type: 'varchar', length: 255 })
    color: string;

    @Column({ type: 'int' })
    seatCount: number;

    @Column({ type: 'enum', enum: EGearBox })
    gearBox: EGearBox;

    @Column({ type: 'int' })
    doorCount: number;

    @Column({ type: 'enum', enum: EFuelType })
    fuelType: EFuelType

    @Column({ type: 'real', precision: 10, scale: 2 })
    maxSpeed: number

    @Column({ type: 'varchar' })
    baggage: string;

    @Column({ type: 'enum', enum: EModelStatus })
    status: EModelStatus;

    @Column({ type: 'real' })
    dailyRentalRate: number;

    /**
    |--------------------------------------------------
    | RELATIONS
    |--------------------------------------------------
    */

    @ManyToOne(() => Brand, (brand) => brand.models, { onDelete: 'CASCADE' })
    brand: Brand;

    @ManyToOne(() => CarType, (carType) => carType.models, { onDelete: "SET NULL" })
    carType: CarType;

    @OneToOne(() => Image)
    @JoinColumn({ name: 'featuredImageId' })
    featuredImage: Image

    @OneToOne(() => ImageGallery)
    @JoinColumn({ name: 'galleryId' })
    gallery: ImageGallery;

    // TODO: Add relation for REVIEW, RENTAL, MAINTENANCE

}

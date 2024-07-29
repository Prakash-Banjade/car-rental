import { Brand } from "src/brands/entities/brand.entity";
import { CarType } from "src/car-types/entities/car-type.entity";
import { BaseEntity } from "src/core/entities/base.entity";
import { EFuelType, EGearBox, EModelStatus } from "src/core/types/global.types";
import { generateSlug } from "src/core/utils/generateSlug";
import { Image } from "src/images/entities/image.entity";
import { RentalItem } from "src/rentals/entities/rental-items.entity";
import { Review } from "src/reviews/entities/review.entity";
import { BeforeInsert, BeforeUpdate, Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne } from "typeorm";

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

    @Column({ type: 'real' })
    power: number;

    @Column({ type: 'varchar', length: 255 })
    acceleration: string;

    @Column({ type: 'varchar', length: 255 })
    driveTrain: string;

    @Column({ type: 'boolean' })
    navigation: boolean

    @Column({ type: 'int' })
    seatCount: number;

    @Column({ type: 'enum', enum: EGearBox, nullable: true })
    gearBox: EGearBox;

    @Column({ type: 'varchar' })
    transmission: string;

    @Column({ type: 'real' })
    engineVolume: number;

    @Column({ type: 'int' })
    doorCount: number;

    @Column({ type: 'enum', enum: EFuelType })
    fuelType: EFuelType

    @Column({ type: 'real', precision: 10, scale: 2 })
    maxSpeed: number

    @Column({ type: 'varchar' })
    baggage: string;

    @Column({ type: 'enum', enum: EModelStatus, default: EModelStatus.AVAILABLE })
    status: EModelStatus;

    @Column({ type: 'real' })
    dailyRentalRate: number;

    @Column({ type: 'real', default: 0 })
    rating: number

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

    @OneToMany(() => Image, (image) => image.model)
    gallery: Image[];

    @OneToMany(() => Review, (review) => review.model)
    reviews: Review[]

    @OneToMany(() => RentalItem, (rentalItem) => rentalItem.model)
    rentalItems: RentalItem[]

}

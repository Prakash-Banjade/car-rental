import { BaseEntity } from "src/core/entities/base.entity";
import { AfterLoad, BeforeInsert, BeforeUpdate, Column, Entity, ManyToOne } from "typeorm";
import { Rental } from "./rental.entity";
import { ERentalStatus } from "src/core/types/global.types";
import { Model } from "src/models/entities/model.entity";
import { BadRequestException } from "@nestjs/common";

@Entity()
export class RentalItem extends BaseEntity {
    @ManyToOne(() => Rental, (rental) => rental.rentalItems, { onDelete: 'CASCADE' })
    rental: Rental

    @ManyToOne(() => Model, (model) => model.rentalItems, { onDelete: 'RESTRICT' })
    model: Model;

    @Column({ type: 'enum', enum: ERentalStatus, default: ERentalStatus.BOOKED })
    status: ERentalStatus = ERentalStatus.BOOKED;

    @AfterLoad()
    setStatus(){
        const now = Date.now();
        const startDate = new Date(this.startDate).getTime()
        const endDate = new Date(this.endDate).getTime()

        if (now >= startDate && now <= endDate) {
            this.status = ERentalStatus.ACTIVE
        }
    }

    @Column({ type: 'varchar' })
    pickupLocation: string;

    @Column({ type: 'varchar' })
    returnLocation: string;

    @Column({ type: 'int' })
    rentalDays: number;

    @Column({ type: 'datetime' })
    startDate: string;

    @Column({ type: 'datetime' })
    endDate: string;

    @Column({ type: 'real', precision: 10, scale: 2 })
    totalAmount: number;

    @BeforeInsert()
    @BeforeUpdate()
    calculateRentalDaysAndPrice() {
        if (this.startDate > this.endDate) {
            throw new BadRequestException('Start date cannot be greater than end date');
        }
        
        const days = Math.ceil((new Date(this.endDate).getTime() - new Date(this.startDate).getTime()) / (1000 * 3600 * 24));
        const totalAmount = days * this.model.dailyRentalRate;

        this.rentalDays = days;
        this.totalAmount = totalAmount;
    }
}
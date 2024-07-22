import { BaseEntity } from "src/core/entities/base.entity";
import { ERentalStatus } from "src/core/types/global.types";
import { generateRentalId } from "src/core/utils/generateRentalId";
import { Model } from "src/models/entities/model.entity";
import { Payment } from "src/payments/entities/payment.entity";
import { User } from "src/users/entities/user.entity";
import { BeforeInsert, BeforeUpdate, Column, Entity, JoinColumn, ManyToOne, OneToOne } from "typeorm";

@Entity()
export class Rental extends BaseEntity {
    @Column({ type: 'varchar' })
    rentalId: string;

    @BeforeInsert()
    generaterentalId() {
        this.rentalId = generateRentalId();
    }

    @ManyToOne(() => User, (user) => user.rentals, { onDelete: 'RESTRICT' })
    user: User;

    @OneToOne(() => Model)
    @JoinColumn({ name: 'model_id' })
    model: Model

    @Column({ type: 'datetime' })
    startDate: string;

    @Column({ type: 'datetime' })
    endDate: string;

    @Column({ type: 'enum', enum: ERentalStatus, default: ERentalStatus.RENTED })
    status: ERentalStatus = ERentalStatus.RENTED;

    @Column({ type: 'varchar' })
    pickupLocation: string;

    @Column({ type: 'varchar' })
    returnLocation: string;

    @Column({ type: 'int' })
    rentalDays: number;

    @Column({ type: 'real', precision: 10, scale: 2 })
    totalAmount: number;

    @BeforeInsert()
    @BeforeUpdate()
    calculateRentalDaysAndPrice() {
        const days = Math.ceil((new Date(this.endDate).getTime() - new Date(this.startDate).getTime()) / (1000 * 3600 * 24));
        const totalAmount = days * this.model.dailyRentalRate;

        this.rentalDays = days;
        this.totalAmount = totalAmount;
    }

    @OneToOne(() => Payment, (payment) => payment.rental)
    @JoinColumn({ name: 'payment_id' })
    payment: Payment

    @Column({ type: 'datetime', nullable: true })
    cancelledAt: string;
}

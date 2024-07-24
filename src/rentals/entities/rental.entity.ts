import { BaseEntity } from "src/core/entities/base.entity";
import { generateRentalId } from "src/core/utils/generateRentalId";
import { Payment } from "src/payments/entities/payment.entity";
import { User } from "src/users/entities/user.entity";
import { AfterLoad, BeforeInsert, BeforeUpdate, Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne } from "typeorm";
import { RentalItem } from "./rental-items.entity";
import { ERentalStatus } from "src/core/types/global.types";

@Entity()
export class Rental extends BaseEntity {
    @Column({ type: 'varchar' })
    rentalId: string;

    @BeforeInsert()
    generaterentalId() {
        this.rentalId = generateRentalId();
    }

    @OneToMany(() => RentalItem, (rentalItem) => rentalItem.rental)
    rentalItems: RentalItem[]

    @ManyToOne(() => User, (user) => user.rentals, { onDelete: 'RESTRICT' })
    user: User;

    @Column({ type: 'real', precision: 10, scale: 2, default: 0 })
    totalAmount: number

    @Column({ type: 'enum', enum: ERentalStatus, default: ERentalStatus.BOOKED })
    status: ERentalStatus;

    @AfterLoad()
    setStatus() {
        this.status = this.rentalItems?.every((item) => item.status === ERentalStatus.RETURNED) ? ERentalStatus.RETURNED : ERentalStatus.BOOKED
    }

    @OneToOne(() => Payment, (payment) => payment.rental)
    payment: Payment

    @Column({ type: 'datetime', nullable: true })
    cancelledAt: string;
}

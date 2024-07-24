import { BaseEntity } from "src/core/entities/base.entity";
import { PaymentMethod, PaymentStatus } from "src/core/types/global.types";
import { Rental } from "src/rentals/entities/rental.entity";
import { BeforeInsert, Column, Entity, JoinColumn, OneToOne } from "typeorm";

@Entity()
export class Payment extends BaseEntity {
    @OneToOne(() => Rental, (rental) => rental.payment, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'rentalId' })
    rental: Rental

    @Column({ type: 'datetime' })
    paymentDate: string;

    @BeforeInsert()
    setPaymentDate() {
        this.paymentDate = new Date().toISOString();
    }

    @Column({ type: "real" })
    amount: number

    @BeforeInsert()
    setAmount() {
        this.amount = this.rental.totalAmount
    }

    @Column({ type: 'enum', enum: PaymentMethod })
    paymentMethod: PaymentMethod

    @Column({ type: 'enum', enum: PaymentStatus, default: PaymentStatus.PENDING })
    status: PaymentStatus

    @Column({ type: 'uuid', nullable: true })
    paymentIntentId: string

    @Column({ type: 'varchar', nullable: true })
    stripePaymentMethod: string

    @Column({ type: 'varchar', nullable: true })
    clientSecret: string
}

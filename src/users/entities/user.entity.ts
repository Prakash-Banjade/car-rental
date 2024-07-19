import { BaseEntity } from "src/core/entities/base.entity";
import { Column, Entity, JoinColumn, OneToOne } from "typeorm";
import { Gender } from "src/core/types/global.types";
import { Account } from "src/accounts/entities/account.entity";
import { Address } from "src/addresses/entities/address.entity";
import { Image } from "src/images/entities/image.entity";

@Entity()
export class User extends BaseEntity {
    @Column({ type: 'varchar', nullable: true })
    phone?: string;

    @Column({ type: 'enum', enum: Gender, nullable: true })
    gender?: Gender

    @Column({ type: 'datetime', nullable: true })
    dob?: string;

    @OneToOne(() => Image, { nullable: true })
    @JoinColumn()
    profileImage?: Image;

    @OneToOne(() => Address, address => address.user, { nullable: true })
    address?: Address

    @OneToOne(() => Account, account => account.user, { nullable: true })
    account: Account
}

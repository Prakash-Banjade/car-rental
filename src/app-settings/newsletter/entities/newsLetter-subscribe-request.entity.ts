import { BeforeInsert, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class NewsLetterSubscribeRequest {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('varchar')
    email: string;

    @Column('varchar')
    hashedVerificationToken: string;

    @Column('timestamp')
    createdAt: Date;

    @BeforeInsert()
    setCreatedAt() {
        this.createdAt = new Date();
    }
}
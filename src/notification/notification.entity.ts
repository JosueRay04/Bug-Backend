import { user } from "src/user/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

export enum type {
    URGENT = 'URGENT',
    NO_URGENT = 'NO URGENT'
}

@Entity()
export class notification{
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    message: string

    @Column()
    type: type

    @ManyToOne(() => user)
    @JoinColumn()
    remmittent: user

    @ManyToOne(() => user)
    @JoinColumn()
    addressee: user

    @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date
}
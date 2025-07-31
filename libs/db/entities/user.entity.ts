import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('users')
export class userEntity{
    @PrimaryGeneratedColumn('uuid')
    id: String

    @Column({unique: true})
    email: String

    @Column()
    password: String

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date
}
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn, OneToOne } from "typeorm";
import { UserProfile } from "./user-profile.entity";

@Entity('users')
export class userEntity{
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column()
    name: string

    @Column({unique: true})
    email: string

    @Column()
    password: string

    @OneToOne(() => UserProfile, profile => profile.user)
    profile: UserProfile;

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date
}
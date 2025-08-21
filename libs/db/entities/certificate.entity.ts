import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { UserProfile } from "./user-profile.entity";

@Entity('certificates')
export class Certificate {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ nullable: true })
  issuedBy: string;

  @Column({ nullable: true })
  year: string;

  @ManyToOne(() => UserProfile, profile => profile.certificates, { onDelete: 'CASCADE' })
  profile: UserProfile;
}

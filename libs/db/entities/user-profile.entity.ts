import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { userEntity } from "./user.entity";
import { Education } from "./education.entity";
import { Project } from "./project.entity";
import { Certificate } from "./certificate.entity";

@Entity('user_profile')
export class UserProfile {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  bio: string;

  @Column({ nullable: true })
  github: string;

  @Column({ nullable: true })
  linkedin: string;

  @Column("simple-array", { nullable: true })
  techstack: string[];

  @Column({ nullable: true })
  profilepic: string;

  @Column({ nullable: true })
  experience: string;

  @OneToOne(() => userEntity, user => user.profile, { onDelete: 'CASCADE' })
  @JoinColumn()
  user: userEntity;

  @OneToMany(() => Project, project => project.profile, { cascade: true })
  projects: Project[];

  @OneToMany(() => Education, education => education.profile, { cascade: true })
  education: Education[];

  @OneToMany(() => Certificate, certificate => certificate.profile, { cascade: true })
  certificates: Certificate[];
}

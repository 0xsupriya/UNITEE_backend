import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserEntity } from './user.entity';
import { Education } from './education.entity';
import { Project } from './project.entity';
import { Certificate } from './certificate.entity';
import { Connection } from './connection.entity';
import { CollabPost } from './collab-post.entity';
import { CollabApplication } from './collab-application.entity';

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

  @Column({ nullable: true })
  profilePic: string;

  @OneToOne(() => UserEntity, (user) => user.profile, { onDelete: 'CASCADE' })
  @JoinColumn()
  user: UserEntity;

  @OneToMany(() => Project, (project) => project.profile, { cascade: true })
  projects: Project[];

  @OneToMany(() => Education, (education) => education.profile, {
    cascade: true,
  })
  education: Education[];

  @OneToMany(() => Certificate, (certificate) => certificate.profile, {
    cascade: true,
  })
  certificates: Certificate[];

  // filtering fields
  @Column({ nullable: true })
  role: string; // Example: "Frontend Developer"

  @Column({ nullable: true })
  experience: string; // Example: "Beginner" | "Intermediate" | "Expert"

  @Column('text', { array: true, nullable: true })
  techstack: string[]; // Example: ["react", "nodejs"]

  @Column('text', { array: true, nullable: true })
  location: string[];

  // sorting fields
  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  lastActiveAt: Date;

  // connections
  @OneToMany(() => Connection, (connection) => connection.requester)
  sentConnections: Connection[];

  @OneToMany(() => Connection, (connection) => connection.receiver)
  receivedConnections: Connection[];

  @Column({ default: 0 })
  connectionCount: number;

  // relationship with collab
  @OneToMany(() => CollabPost, (post) => post.creator)
  collabPosts: CollabPost[];

  @OneToMany(() => CollabApplication, (app) => app.applicant)
  applications: CollabApplication[];
}

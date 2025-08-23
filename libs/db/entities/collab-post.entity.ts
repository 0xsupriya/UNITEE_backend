import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserProfile } from './user-profile.entity';
import { CollabApplication } from './collab-application.entity';

export enum CollabType {
  HACKATHON = 'hackathon',
  PROJECT = 'project',
  FREELANCE = 'freelance',
  OTHER = 'other',
}

@Entity('collab_posts')
export class CollabPost {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'enum', enum: CollabType })
  type: CollabType;

  @Column('simple-array')
  techStack: string[]; // ["React", "Node.js", ...]

  // Relation to the creator
  @ManyToOne(() => UserProfile, (user) => user.collabPosts, {
    onDelete: 'CASCADE',
  })
  creator: UserProfile;

  // Relation to applications
  @OneToMany(() => CollabApplication, (application) => application.post, {
    cascade: true,
  })
  applications: CollabApplication[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

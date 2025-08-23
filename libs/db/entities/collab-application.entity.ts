import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { UserProfile } from './user-profile.entity';
import { CollabPost } from './collab-post.entity';

export enum ApplicationStatus {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  REJECTED = 'rejected',
}

@Entity('collab_applications')
export class CollabApplication {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => UserProfile, (user) => user.applications, {
    onDelete: 'CASCADE',
  })
  applicant: UserProfile;

  @ManyToOne(() => CollabPost, (post) => post.applications, {
    onDelete: 'CASCADE',
  })
  post: CollabPost;

  @Column({
    type: 'enum',
    enum: ApplicationStatus,
    default: ApplicationStatus.PENDING,
  })
  status: ApplicationStatus;

  @Column({ type: 'text', nullable: true })
  message: string; // Applicant's message (optional)

  @CreateDateColumn()
  appliedAt: Date;
}

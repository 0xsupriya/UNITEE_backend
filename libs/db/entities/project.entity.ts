import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UserProfile } from './user-profile.entity';

@Entity('projects')
export class Project {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  githubLink: string;

  @Column('simple-array', { nullable: true })
  techUsed: string[];

  @ManyToOne(() => UserProfile, (profile) => profile.projects, {
    onDelete: 'CASCADE',
  })
  profile: UserProfile;
}

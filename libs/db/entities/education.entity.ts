import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UserProfile } from './user-profile.entity';

@Entity('education')
export class Education {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  degree: string;

  @Column()
  institution: string;

  @Column()
  year: string;

  @ManyToOne(() => UserProfile, (profile) => profile.education, {
    onDelete: 'CASCADE',
  })
  profile: UserProfile;
}

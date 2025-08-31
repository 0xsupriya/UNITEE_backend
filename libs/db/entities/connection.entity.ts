import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  Column,
  CreateDateColumn,
} from 'typeorm';
import { UserProfile } from './user-profile.entity';

@Entity('connections')
export class Connection {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // who sent the request
  @ManyToOne(() => UserProfile, (user) => user.sentConnections, {
    onDelete: 'CASCADE',
  })
  requester: UserProfile;

  // who received the request
  @ManyToOne(() => UserProfile, (user) => user.receivedConnections, {
    onDelete: 'CASCADE',
  })
  receiver: UserProfile;

  @Column({
    type: 'enum',
    enum: ['pending', 'accepted', 'rejected'],
    default: 'pending',
  })
  status: 'pending' | 'accepted' | 'rejected';

  @CreateDateColumn()
  createdAt: Date;
}

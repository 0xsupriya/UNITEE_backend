import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserProfile } from 'libs/db/entities/user-profile.entity';
import { Connection } from 'libs/db/entities/connection.entity';
import { FilterUsersDto } from './dto/filter-users.dto';

@Injectable()
export class ExploreService {
  constructor(
    @InjectRepository(UserProfile)
    private readonly userProfileRepo: Repository<UserProfile>,

    @InjectRepository(Connection)
    private readonly connectionRepo: Repository<Connection>,
  ) {}

// 1. Filter & Sort Users
  async filterUsers(filterDto: FilterUsersDto) {
    const { role, experience, location, techstack, sortBy } = filterDto;

    let query = this.userProfileRepo.createQueryBuilder('userProfile');

    if (role) query.andWhere('userProfile.role = :role', { role });
    if (experience) query.andWhere('userProfile.experience = :experience', { experience });
    if (location) query.andWhere('userProfile.location = :location', { location });
    if (techstack) query.andWhere('userProfile.techstack && ARRAY[:...techstack]', { techstack });

   // sorting
  if (sortBy === 'most_active') {
  query.orderBy('userProfile.lastActiveAt', 'DESC'); 
    } else if (sortBy === 'recently_joined') {
    query.orderBy('userProfile.createdAt', 'DESC');
    } else if (sortBy === 'most_connections') {
    query
    .leftJoin('userProfile.connections', 'connection')
    .addSelect('COUNT(connection.id)', 'connectionCount') 
    .groupBy('userProfile.id')
    .orderBy('connectionCount', 'DESC');
  }

    return await query.getMany();

  }

// 2. View User Profile
  async getUserProfile(id: string) {
    const profile = await this.userProfileRepo.findOne({ where: { id } });
    if (!profile) throw new NotFoundException('User profile not found');
    return profile;
  }

// 3. Send Connection Request
  async sendConnection(senderId: string, receiverId: string) {
    if (senderId === receiverId) {
      throw new BadRequestException('You cannot connect with yourself');
    }

    const existing = await this.connectionRepo.findOne({
      where: [
        { requester: { id: senderId }, receiver: { id: receiverId } },
        { requester: { id: receiverId }, receiver: { id: senderId } },
      ],
    });

    if (existing) {
      throw new BadRequestException('Connection request already exists');
    }

    const connection = this.connectionRepo.create({
      requester: { id: senderId },
      receiver: { id: receiverId },
      status: 'pending',
    });

    return await this.connectionRepo.save(connection);
  }
}

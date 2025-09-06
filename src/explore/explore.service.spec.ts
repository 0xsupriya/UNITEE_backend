import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { ExploreService } from './explore.service';
import { UserProfile } from 'libs/db/entities/user-profile.entity';
import { Connection } from 'libs/db/entities/connection.entity';
import { FilterUsersDto } from './dto/filter-users.dto';

describe('ExploreService', () => {
  let service: ExploreService;
  let userProfileRepo: jest.Mocked<Repository<UserProfile>>;
  let connectionRepo: jest.Mocked<Repository<Connection>>;

  beforeEach(async () => {
    const mockQueryBuilder = {
      andWhere: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      leftJoin: jest.fn().mockReturnThis(),
      addSelect: jest.fn().mockReturnThis(),
      groupBy: jest.fn().mockReturnThis(),
      getMany: jest.fn().mockResolvedValue([]),
    };

    const mockUserProfileRepo = {
      findOne: jest.fn(),
      createQueryBuilder: jest.fn().mockReturnValue(mockQueryBuilder),
    };

    const mockConnectionRepo = {
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ExploreService,
        {
          provide: getRepositoryToken(UserProfile),
          useValue: mockUserProfileRepo,
        },
        {
          provide: getRepositoryToken(Connection),
          useValue: mockConnectionRepo,
        },
      ],
    }).compile();

    service = module.get<ExploreService>(ExploreService);
    userProfileRepo = module.get(getRepositoryToken(UserProfile));
    connectionRepo = module.get(getRepositoryToken(Connection));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('filterUsers', () => {
    it('should filter users by role', async () => {
      const filterDto: FilterUsersDto = {
        role: 'Frontend Developer',
      };

      await service.filterUsers(filterDto);

      expect(userProfileRepo.createQueryBuilder).toHaveBeenCalledWith('userProfile');
    });

    it('should handle empty filter object', async () => {
      const filterDto: FilterUsersDto = {};

      await service.filterUsers(filterDto);

      expect(userProfileRepo.createQueryBuilder).toHaveBeenCalledWith('userProfile');
    });
  });

  describe('getUserProfile', () => {
    it('should return user profile successfully', async () => {
      const profileId = 'profile-123';
      const mockProfile = {
        id: profileId,
        name: 'John Doe',
        role: 'Frontend Developer',
      } as UserProfile;

      userProfileRepo.findOne.mockResolvedValue(mockProfile);

      const result = await service.getUserProfile(profileId);

      expect(userProfileRepo.findOne).toHaveBeenCalledWith({
        where: { id: profileId },
      });
      expect(result).toEqual(mockProfile);
    });

    it('should throw NotFoundException when profile does not exist', async () => {
      const profileId = 'non-existent-profile';
      userProfileRepo.findOne.mockResolvedValue(null);

      await expect(service.getUserProfile(profileId)).rejects.toThrow(
        new NotFoundException('User profile not found')
      );
    });
  });

  describe('sendConnection', () => {
    const senderId = 'sender-123';
    const receiverId = 'receiver-123';

    it('should send connection request successfully', async () => {
      const mockConnection = {
        id: 'connection-123',
        requester: { id: senderId },
        receiver: { id: receiverId },
        status: 'pending',
      } as Connection;

      connectionRepo.findOne.mockResolvedValue(null);
      connectionRepo.create.mockReturnValue(mockConnection);
      connectionRepo.save.mockResolvedValue(mockConnection);

      const result = await service.sendConnection(senderId, receiverId);

      expect(connectionRepo.create).toHaveBeenCalledWith({
        requester: { id: senderId },
        receiver: { id: receiverId },
        status: 'pending',
      });
      expect(result).toEqual(mockConnection);
    });

    it('should throw BadRequestException when trying to connect with yourself', async () => {
      const userId = 'user-123';

      await expect(service.sendConnection(userId, userId)).rejects.toThrow(
        new BadRequestException('You cannot connect with yourself')
      );

      expect(connectionRepo.findOne).not.toHaveBeenCalled();
    });

    it('should throw BadRequestException when connection already exists', async () => {
      const existingConnection = {
        id: 'existing-connection',
        requester: { id: senderId },
        receiver: { id: receiverId },
        status: 'pending',
      } as Connection;

      connectionRepo.findOne.mockResolvedValue(existingConnection);

      await expect(service.sendConnection(senderId, receiverId)).rejects.toThrow(
        new BadRequestException('Connection request already exists')
      );

      expect(connectionRepo.create).not.toHaveBeenCalled();
    });
  });
});
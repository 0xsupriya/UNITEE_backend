import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { 
  BadRequestException, 
  NotFoundException 
} from '@nestjs/common';
import { ProfileService } from './user-profile.service';
import { UserProfile } from 'libs/db/entities/user-profile.entity';
import { CreateUserProfileDto } from './dto/create-user-profile.dto';
import { UpdateUserProfileDto } from './dto/update-user-profile.dto';

describe('ProfileService', () => {
  let service: ProfileService;
  let profileRepository: jest.Mocked<Repository<UserProfile>>;

  beforeEach(async () => {
    const mockProfileRepository = {
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProfileService,
        {
          provide: getRepositoryToken(UserProfile),
          useValue: mockProfileRepository,
        },
      ],
    }).compile();

    service = module.get<ProfileService>(ProfileService);
    profileRepository = module.get(getRepositoryToken(UserProfile));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createProfile', () => {
    const createProfileDto: CreateUserProfileDto = {
      name: 'John Doe',
      bio: 'Software Developer',
      github: 'https://github.com/johndoe',
      linkedin: 'https://linkedin.com/in/johndoe',
      techstack: ['React', 'Node.js'],
      experience: 'Intermediate',
    };

    const userId = 'user-123';

    it('should create a profile successfully', async () => {
      // Arrange
      profileRepository.findOne.mockResolvedValue(null); // No existing profile
      const mockProfile = { 
        id: 'profile-123', 
        ...createProfileDto, 
        user: { id: userId } 
      };
      profileRepository.create.mockReturnValue(mockProfile as any);
      profileRepository.save.mockResolvedValue(mockProfile as any);

      // Act
      const result = await service.createProfile(userId, createProfileDto);

      // Assert
      expect(profileRepository.findOne).toHaveBeenCalledWith({
        where: { user: { id: userId } },
      });
      expect(profileRepository.create).toHaveBeenCalledWith({
        ...createProfileDto,
        user: { id: userId },
      });
      expect(profileRepository.save).toHaveBeenCalledWith(mockProfile);
      expect(result).toEqual(mockProfile);
    });

    it('should throw BadRequestException if profile already exists', async () => {
      // Arrange
      const existingProfile = { id: 'existing-profile', user: { id: userId } };
      profileRepository.findOne.mockResolvedValue(existingProfile as any);

      // Act & Assert
      await expect(
        service.createProfile(userId, createProfileDto),
      ).rejects.toThrow(
        new BadRequestException('Profile already exists for this user'),
      );

      expect(profileRepository.findOne).toHaveBeenCalledWith({
        where: { user: { id: userId } },
      });
      expect(profileRepository.create).not.toHaveBeenCalled();
      expect(profileRepository.save).not.toHaveBeenCalled();
    });
  });

  describe('updateProfile', () => {
    const userId = 'user-123';
    const updateDto: UpdateUserProfileDto = {
      bio: 'Updated bio',
      techstack: ['React', 'Vue.js'],
    };

    it('should update profile successfully', async () => {
      // Arrange
      const existingProfile = {
        id: 'profile-123',
        name: 'John Doe',
        bio: 'Old bio',
        user: { id: userId },
      };
      
      const updatedProfile = {
        ...existingProfile,
        ...updateDto,
      };

      profileRepository.findOne.mockResolvedValue(existingProfile as any);
      profileRepository.save.mockResolvedValue(updatedProfile as any);

      // Act
      const result = await service.updateProfile(userId, updateDto);

      // Assert
      expect(profileRepository.findOne).toHaveBeenCalledWith({
        where: { user: { id: userId } },
        relations: ['user'],
      });
      expect(profileRepository.save).toHaveBeenCalledWith(updatedProfile);
      expect(result).toEqual(updatedProfile);
    });

    it('should throw NotFoundException if profile does not exist', async () => {
      // Arrange
      profileRepository.findOne.mockResolvedValue(null);

      // Act & Assert
      await expect(
        service.updateProfile(userId, updateDto),
      ).rejects.toThrow(new NotFoundException('Profile not found'));

      expect(profileRepository.findOne).toHaveBeenCalledWith({
        where: { user: { id: userId } },
        relations: ['user'],
      });
      expect(profileRepository.save).not.toHaveBeenCalled();
    });

    it('should throw BadRequestException if no update fields provided', async () => {
      // Act & Assert
      await expect(
        service.updateProfile(userId, {}),
      ).rejects.toThrow(
        new BadRequestException('No update fields provided'),
      );

      expect(profileRepository.findOne).not.toHaveBeenCalled();
    });
  });

  describe('deleteProfile', () => {
    const userId = 'user-123';

    it('should delete profile successfully', async () => {
      // Arrange
      const deleteResult = { affected: 1 };
      profileRepository.delete.mockResolvedValue(deleteResult as any);

      // Act
      const result = await service.deleteProfile(userId);

      // Assert
      expect(profileRepository.delete).toHaveBeenCalledWith({
        user: { id: userId },
      });
      expect(result).toEqual({ message: 'Profile deleted successfully' });
    });

    it('should throw NotFoundException if profile not found', async () => {
      // Arrange
      const deleteResult = { affected: 0 };
      profileRepository.delete.mockResolvedValue(deleteResult as any);

      // Act & Assert
      await expect(service.deleteProfile(userId)).rejects.toThrow(
        new NotFoundException('Profile not found'),
      );

      expect(profileRepository.delete).toHaveBeenCalledWith({
        user: { id: userId },
      });
    });
  });

  describe('getMyProfile', () => {
    const userId = 'user-123';

    it('should return user profile', async () => {
      // Arrange
      const mockProfile = {
        id: 'profile-123',
        name: 'John Doe',
        user: { id: userId },
      };
      profileRepository.findOne.mockResolvedValue(mockProfile as any);

      // Act
      const result = await service.getMyProfile(userId);

      // Assert
      expect(profileRepository.findOne).toHaveBeenCalledWith({
        where: { user: { id: userId } },
        relations: ['user'],
      });
      expect(result).toEqual(mockProfile);
    });

    it('should throw NotFoundException if profile not found', async () => {
      // Arrange
      profileRepository.findOne.mockResolvedValue(null);

      // Act & Assert
      await expect(service.getMyProfile(userId)).rejects.toThrow(
        new NotFoundException('Profile not found'),
      );
    });
  });

  describe('getProfileByUserId', () => {
    const userId = 'user-123';

    it('should return profile by user id', async () => {
      // Arrange
      const mockProfile = {
        id: 'profile-123',
        name: 'John Doe',
        user: { id: userId },
      };
      profileRepository.findOne.mockResolvedValue(mockProfile as any);

      // Act
      const result = await service.getProfileByUserId(userId);

      // Assert
      expect(profileRepository.findOne).toHaveBeenCalledWith({
        where: { user: { id: userId } },
        relations: ['user'],
      });
      expect(result).toEqual(mockProfile);
    });

    it('should return null if profile not found', async () => {
      // Arrange
      profileRepository.findOne.mockResolvedValue(null);

      // Act
      const result = await service.getProfileByUserId(userId);

      // Assert
      expect(result).toBeNull();
    });
  });
});

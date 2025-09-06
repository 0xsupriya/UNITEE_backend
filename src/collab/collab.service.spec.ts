import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { CollabService } from './collab.service';
import { CollabPost } from 'libs/db/entities/collab-post.entity';
import { CollabApplication } from 'libs/db/entities/collab-application.entity';
import { UserProfile } from 'libs/db/entities/user-profile.entity';
import { CreateCollabPostDto } from './dto/create-collab-post.dto';
import { FilterCollabPostsDto } from './dto/filter-collab-post.dto';
import { ApplyCollabDto } from './dto/apply-collab-post.dto';
import { CollabType } from 'libs/db/entities/collab-post.entity';

describe('CollabService', () => {
  let service: CollabService;
  let collabPostRepo: jest.Mocked<Repository<CollabPost>>;
  let collabAppRepo: jest.Mocked<Repository<CollabApplication>>;

  beforeEach(async () => {
    const mockQueryBuilder = {
      leftJoinAndSelect: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      getMany: jest.fn().mockResolvedValue([]),
    };

    const mockCollabPostRepo = {
      create: jest.fn(),
      save: jest.fn(),
      findOne: jest.fn(),
      createQueryBuilder: jest.fn().mockReturnValue(mockQueryBuilder),
    };

    const mockCollabAppRepo = {
      create: jest.fn(),
      save: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CollabService,
        {
          provide: getRepositoryToken(CollabPost),
          useValue: mockCollabPostRepo,
        },
        {
          provide: getRepositoryToken(CollabApplication),
          useValue: mockCollabAppRepo,
        },
      ],
    }).compile();

    service = module.get<CollabService>(CollabService);
    collabPostRepo = module.get(getRepositoryToken(CollabPost));
    collabAppRepo = module.get(getRepositoryToken(CollabApplication));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createPost', () => {
    it('should create a collaboration post successfully', async () => {
      // Arrange
      const mockUser = {
        id: 'user-123',
        name: 'Test User',
      } as UserProfile;

      const createPostDto: CreateCollabPostDto = {
        title: 'React Developer Needed',
        category: 'PROJECT',
        overview: 'Looking for a React developer for my project',
        requirements: ['React experience', 'TypeScript knowledge'],
        responsibilities: ['Frontend development', 'Code review'],
        techStacks: ['React', 'TypeScript'],
      };

      const mockPost = {
        id: 'post-123',
        ...createPostDto,
        creator: mockUser,
      };

      collabPostRepo.create.mockReturnValue(mockPost as unknown as CollabPost);
      collabPostRepo.save.mockResolvedValue(mockPost as unknown as CollabPost);

      // Act
      const result = await service.createPost(createPostDto, mockUser);

      // Assert
      expect(collabPostRepo.create).toHaveBeenCalledWith({
        ...createPostDto,
        creator: mockUser,
      });
      expect(collabPostRepo.save).toHaveBeenCalledWith(mockPost);
      expect(result).toEqual(mockPost);
    });
  });

  describe('findPosts', () => {
    it('should call createQueryBuilder with correct parameters', async () => {
      // Arrange
      const filterDto: FilterCollabPostsDto = {
        category: CollabType.HACKATHON,
      };

      // Act
      await service.findPosts(filterDto);

      // Assert
      expect(collabPostRepo.createQueryBuilder).toHaveBeenCalledWith('post');
    });

    it('should handle empty filter object', async () => {
      // Arrange
      const filterDto: FilterCollabPostsDto = {};

      // Act
      await service.findPosts(filterDto);

      // Assert
      expect(collabPostRepo.createQueryBuilder).toHaveBeenCalledWith('post');
    });
  });

  describe('applyToPost', () => {
    const mockUser = {
      id: 'user-123',
      name: 'Test User',
    } as UserProfile;

    const applyDto: ApplyCollabDto = {
      message: 'I would like to join this project',
    };

    it('should allow user to apply to a collaboration post', async () => {
      // Arrange
      const postId = 'post-123';
      const mockPost = {
        id: postId,
        title: 'React Project',
      } as CollabPost;

      const mockApplication = {
        id: 'app-123',
        message: applyDto.message,
        applicant: mockUser,
        post: mockPost,
      } as CollabApplication;

      collabPostRepo.findOne.mockResolvedValue(mockPost);
      collabAppRepo.create.mockReturnValue(mockApplication);
      collabAppRepo.save.mockResolvedValue(mockApplication);

      // Act
      const result = await service.applyToPost(postId, applyDto, mockUser);

      // Assert
      expect(collabPostRepo.findOne).toHaveBeenCalledWith({
        where: { id: postId },
      });
      expect(collabAppRepo.create).toHaveBeenCalledWith({
        message: applyDto.message,
        applicant: mockUser,
        post: mockPost,
      });
      expect(collabAppRepo.save).toHaveBeenCalledWith(mockApplication);
      expect(result).toEqual(mockApplication);
    });

    it('should throw NotFoundException when post does not exist', async () => {
      // Arrange
      const postId = 'nonexistent-post';
      collabPostRepo.findOne.mockResolvedValue(null);

      // Act & Assert
      await expect(
        service.applyToPost(postId, applyDto, mockUser),
      ).rejects.toThrow(new NotFoundException('Collab post not found'));

      expect(collabPostRepo.findOne).toHaveBeenCalledWith({
        where: { id: postId },
      });
      expect(collabAppRepo.create).not.toHaveBeenCalled();
      expect(collabAppRepo.save).not.toHaveBeenCalled();
    });
  });
});

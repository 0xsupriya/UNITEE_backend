import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UserEntity } from '../../libs/db/entities/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { BadRequestException } from '@nestjs/common';
import { SignUpDto } from './dto/signUp.dto';
import { SignInDto } from './dto/signIn.dto';
import * as bcrypt from 'bcrypt';

// Mock bcrypt
jest.mock('bcrypt');
const mockedBcrypt = bcrypt as jest.Mocked<typeof bcrypt>;

describe('AuthService', () => {
  let service: AuthService;
  let userRepository: any;
  let jwtService: any;

  beforeEach(async () => {
    // Reset all mocks before each test
    jest.resetAllMocks();
    
    const mockUserRepository = {
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
    };

    const mockJwtService = {
      sign: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getRepositoryToken(UserEntity),
          useValue: mockUserRepository,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userRepository = module.get(getRepositoryToken(UserEntity));
    jwtService = module.get(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('signUp', () => {
    const signUpDto: SignUpDto = {
      email: 'test@example.com',
      name: 'Test User',
      password: 'password123456',
    };

    it('should sign up a new user successfully', async () => {
      userRepository.findOne.mockResolvedValue(null);
      
      const hashedPassword = 'hashedPassword123';
      (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword);

      const newUser = { 
        id: 'uuid-123', 
        name: 'Test User',
        email: 'test@example.com', 
        password: hashedPassword,
        createdAt: new Date(),
        updatedAt: new Date()
      } as UserEntity;
      userRepository.create.mockReturnValue(newUser);
      userRepository.save.mockResolvedValue(newUser);

      const result = await service.signUp(signUpDto);

      expect(userRepository.findOne).toHaveBeenCalledWith({ 
        where: { email: 'test@example.com' } 
      });
      expect(userRepository.create).toHaveBeenCalledWith({
        name: 'Test User',
        email: 'test@example.com',
        password: hashedPassword,
      });
      expect(userRepository.save).toHaveBeenCalledWith(newUser);
      expect(result).toEqual({
        message: 'User Registered Successfully'
      });
    });

    it('should throw BadRequestException if email already exists', async () => {
      const existingUser = { id: '1', email: signUpDto.email };
      userRepository.findOne.mockResolvedValue(existingUser as UserEntity);

      await expect(service.signUp(signUpDto)).rejects.toThrow(
        new BadRequestException('Email already in use'),
      );
      expect(userRepository.findOne).toHaveBeenCalledWith({
        where: { email: signUpDto.email },
      });
      expect(userRepository.create).not.toHaveBeenCalled();
      expect(userRepository.save).not.toHaveBeenCalled();
    });
  });

  describe('signIn', () => {
    const signInDto: SignInDto = {
      email: 'test@example.com',
      password: 'password123456',
    };

    const mockUser = {
      id: 'user-123',
      email: signInDto.email,
      password: 'hashedPassword123',
      name: 'Test User',
    };

    it('should successfully sign in user with correct credentials', async () => {
      const jwtToken = 'jwt-token-123';
      userRepository.findOne.mockResolvedValue(mockUser as UserEntity);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      jwtService.sign.mockReturnValue(jwtToken);

      const result = await service.signIn(signInDto);

      expect(userRepository.findOne).toHaveBeenCalledWith({
        where: { email: signInDto.email },
      });
      expect(jwtService.sign).toHaveBeenCalledWith({
        id: mockUser.id,
        email: mockUser.email,
      });
      expect(result).toEqual({
        message: 'SignIn Successful',
        token: jwtToken,
      });
    });

    it('should throw BadRequestException if user not found', async () => {
      userRepository.findOne.mockResolvedValue(null);

      await expect(service.signIn(signInDto)).rejects.toThrow(
        new BadRequestException('User not found'),
      );
      expect(userRepository.findOne).toHaveBeenCalledWith({
        where: { email: signInDto.email },
      });
      expect(jwtService.sign).not.toHaveBeenCalled();
    });

    it('should throw BadRequestException if password is incorrect', async () => {
      userRepository.findOne.mockResolvedValue(mockUser as UserEntity);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(service.signIn(signInDto)).rejects.toThrow(
        new BadRequestException('Invalid Credentials'),
      );
      expect(userRepository.findOne).toHaveBeenCalledWith({
        where: { email: signInDto.email },
      });
      expect(jwtService.sign).not.toHaveBeenCalled();
    });
  });
});

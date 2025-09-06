import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserEntity } from '../libs/db/entities/user.entity';
import { Repository } from 'typeorm';

describe('Authentication (e2e)', () => {
  let app: INestApplication;
  let userRepository: Repository<UserEntity>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    
    // Apply the same validation pipe as in main.ts
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    
    userRepository = moduleFixture.get<Repository<UserEntity>>(
      getRepositoryToken(UserEntity),
    );
    
    await app.init();
  });

  afterEach(async () => {
    // Clean up database after each test
    await userRepository.clear();
    await app.close();
  });

  describe('/auth/sign-up (POST)', () => {
    it('should register a new user successfully', () => {
      const signUpData = {
        email: 'test@example.com',
        name: 'Test User',
        password: 'password123456',
      };

      return request(app.getHttpServer())
        .post('/auth/sign-up')
        .send(signUpData)
        .expect(201)
        .expect((res) => {
          expect(res.body.message).toBe('User Registered Successfully');
        });
    });

    it('should reject duplicate email registration', async () => {
      const signUpData = {
        email: 'test@example.com',
        name: 'Test User',
        password: 'password123456',
      };

      // First registration
      await request(app.getHttpServer())
        .post('/auth/sign-up')
        .send(signUpData)
        .expect(201);

      // Second registration with same email
      return request(app.getHttpServer())
        .post('/auth/sign-up')
        .send(signUpData)
        .expect(400)
        .expect((res) => {
          expect(res.body.message).toBe('Email already in use');
        });
    });

    it('should reject invalid email format', () => {
      const signUpData = {
        email: 'invalid-email',
        name: 'Test User',
        password: 'password123456',
      };

      return request(app.getHttpServer())
        .post('/auth/sign-up')
        .send(signUpData)
        .expect(400);
    });

    it('should reject short password', () => {
      const signUpData = {
        email: 'test@example.com',
        name: 'Test User',
        password: 'short',
      };

      return request(app.getHttpServer())
        .post('/auth/sign-up')
        .send(signUpData)
        .expect(400);
    });

    it('should reject missing required fields', () => {
      const signUpData = {
        email: 'test@example.com',
        // missing name and password
      };

      return request(app.getHttpServer())
        .post('/auth/sign-up')
        .send(signUpData)
        .expect(400);
    });
  });

  describe('/auth/sign-in (POST)', () => {
    beforeEach(async () => {
      // Create a user for login tests
      const signUpData = {
        email: 'test@example.com',
        name: 'Test User',
        password: 'password123456',
      };

      await request(app.getHttpServer())
        .post('/auth/sign-up')
        .send(signUpData);
    });

    it('should login user with correct credentials', () => {
      const signInData = {
        email: 'test@example.com',
        password: 'password123456',
      };

      return request(app.getHttpServer())
        .post('/auth/sign-in')
        .send(signInData)
        .expect(201)
        .expect((res) => {
          expect(res.body.message).toBe('SignIn Successful');
          expect(res.body.token).toBeDefined();
          expect(typeof res.body.token).toBe('string');
        });
    });

    it('should reject incorrect email', () => {
      const signInData = {
        email: 'wrong@example.com',
        password: 'password123456',
      };

      return request(app.getHttpServer())
        .post('/auth/sign-in')
        .send(signInData)
        .expect(400)
        .expect((res) => {
          expect(res.body.message).toBe('User not found');
        });
    });

    it('should reject incorrect password', () => {
      const signInData = {
        email: 'test@example.com',
        password: 'wrongpassword',
      };

      return request(app.getHttpServer())
        .post('/auth/sign-in')
        .send(signInData)
        .expect(400)
        .expect((res) => {
          expect(res.body.message).toBe('Invalid Credentials');
        });
    });
  });

  describe('/auth/me (GET)', () => {
    let authToken: string;

    beforeEach(async () => {
      // Create and login user to get token
      const signUpData = {
        email: 'test@example.com',
        name: 'Test User',
        password: 'password123456',
      };

      await request(app.getHttpServer())
        .post('/auth/sign-up')
        .send(signUpData);

      const signInResponse = await request(app.getHttpServer())
        .post('/auth/sign-in')
        .send({
          email: signUpData.email,
          password: signUpData.password,
        });

      authToken = signInResponse.body.token;
    });

    it('should return user data with valid token', () => {
      return request(app.getHttpServer())
        .get('/auth/me')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.email).toBe('test@example.com');
          expect(res.body.id).toBeDefined();
        });
    });

    it('should reject request without token', () => {
      return request(app.getHttpServer())
        .get('/auth/me')
        .expect(401);
    });

    it('should reject request with invalid token', () => {
      return request(app.getHttpServer())
        .get('/auth/me')
        .set('Authorization', 'Bearer invalid-token')
        .expect(401);
    });
  });
});

import { Injectable, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { userEntity } from '../../libs/db/entities/user.entity';
import { signUpDto } from './dto/signUp.dto';
import { signInDto } from './dto/signIn.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(userEntity) private userRepo: Repository<userEntity>,
    private jwtService: JwtService,
  ) {}

  async signup(dto: signUpDto) {
    const userExists = await this.userRepo.findOne({ where: { email: dto.email } });
    if (userExists) throw new ForbiddenException('Email already registered');

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const newUser = this.userRepo.create({
      name: dto.name,
      email: dto.email,
      password: hashedPassword,
    });

    const savedUser = await this.userRepo.save(newUser);
    return this.signToken(savedUser.id, savedUser.email);
  }

  async signin(dto: signInDto) {
    const user = await this.userRepo.findOne({ where: { email: dto.email } });
    if (!user) throw new ForbiddenException('Invalid credentials');

    const passwordMatches = await bcrypt.compare(dto.password, user.password);
    if (!passwordMatches) throw new ForbiddenException('Invalid credentials');

    return this.signToken(user.id, user.email);
  }

  async signToken(userId: string, email: string): Promise<{ access_token: string }> {
    const payload = { sub: userId, email };
    const token = await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_SECRET,
      expiresIn: '15m',
    });

    return { access_token: token };
  }
}
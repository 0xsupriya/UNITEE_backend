import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProfileController } from './user-profile.controller';
import { ProfileService } from './user-profile.service';
import { UserProfile } from 'libs/db/entities/user-profile.entity';
import { UserEntity } from 'libs/db/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserProfile, UserEntity])],
  controllers: [ProfileController],
  providers: [ProfileService],
  exports: [ProfileService],
})
export class UserProfileModule {}

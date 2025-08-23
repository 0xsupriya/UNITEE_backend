import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExploreService } from './explore.service';
import { ExploreController } from './explore.controller';
import { UserProfile } from 'libs/db/entities/user-profile.entity';
import { Connection } from 'libs/db/entities/connection.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserProfile, Connection])],
  controllers: [ExploreController],
  providers: [ExploreService],
})
export class ExploreModule {}

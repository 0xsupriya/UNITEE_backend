import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CollabService } from './collab.service';
import { CollabController } from './collab.controller';
import { CollabPost } from 'libs/db/entities/collab-post.entity';
import { CollabApplication } from 'libs/db/entities/collab-application.entity';
import { UserProfile } from 'libs/db/entities/user-profile.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([CollabPost, CollabApplication, UserProfile]),
  ],
  providers: [CollabService],
  controllers: [CollabController],
})
export class CollabModule {}

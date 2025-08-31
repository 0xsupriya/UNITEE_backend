import { registerAs } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Certificate } from 'libs/db/entities/certificate.entity';
import { CollabApplication } from 'libs/db/entities/collab-application.entity';
import { CollabPost } from 'libs/db/entities/collab-post.entity';
import { Connection } from 'libs/db/entities/connection.entity';
import { Education } from 'libs/db/entities/education.entity';
import { Project } from 'libs/db/entities/project.entity';
import { UserProfile } from 'libs/db/entities/user-profile.entity';
import { UserEntity } from 'libs/db/entities/user.entity';

export const databaseConfig = registerAs(
  'database',
  (): TypeOrmModuleOptions => ({
    type: 'postgres',
    url: process.env.DATABASE_URL, // will be loaded by ConfigModule
    entities: [
      UserEntity,
      UserProfile,
      Education,
      Project,
      Certificate,
      Connection,
      CollabPost,
      CollabApplication,
    ],
    synchronize: process.env.NODE_ENV !== 'production', // Only sync in development
    migrations: ['dist/migrations/*{.ts,.js}'],
    migrationsRun: process.env.NODE_ENV === 'production',
  }),
);

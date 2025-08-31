import { Module } from '@nestjs/common';
import { UserEntity } from './entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dbService } from './db.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  providers: [dbService],
  exports: [TypeOrmModule, dbService],
})
export class dbModule {}

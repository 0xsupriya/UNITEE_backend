import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { SrcModule } from './lib/common/src/src.module';
import { UserModule } from './user/user.module';
import { CollabModule } from './collab/collab.module';
import { ExploreModule } from './explore/explore.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [AuthModule, ExploreModule, CollabModule, UserModule, SrcModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

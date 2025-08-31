import {
  Body,
  Req,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';

import { ProfileService } from './user-profile.service';
import { CreateUserProfileDto } from './dto/create-user-profile.dto';
import { UpdateUserProfileDto } from './dto/update-user-profile.dto';
import { JwtGuard } from 'src/auth/jwt.guard';

@Controller('profile')
@UseGuards(JwtGuard)
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Post()
  async createProfile(@Req() req, @Body() dto: CreateUserProfileDto) {
    const user = req.user;
    return this.profileService.createProfile(user.id, dto);
  }

  @Get('me')
  async getMyProfile(@Req() req) {
    const user = req.user;
    return this.profileService.getMyProfile(user.id);
  }

  @Get(':userId')
  async getProfileByUserId(@Param('userId') userId: string) {
    return this.profileService.getProfileByUserId(userId);
  }

  @Put()
  async updateProfile(@Req() req, @Body() dto: UpdateUserProfileDto) {
    const user = req.user;
    return this.profileService.updateProfile(user.id, dto);
  }

  @Delete()
  async deleteProfile(@Req() req) {
    const user = req.user;
    return this.profileService.deleteProfile(user.id);
  }
}

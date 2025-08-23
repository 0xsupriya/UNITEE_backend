import { Controller, Get, Query, Param, Post, Body, UseGuards, Req } from '@nestjs/common';
import { ExploreService } from './explore.service';
import { FilterUsersDto } from './dto/filter-users.dto';
import { JwtGuard } from 'src/auth/jwt.guard';

@Controller('explore')
@UseGuards(JwtGuard) // protect all routes with JWT
export class ExploreController {
  constructor(private readonly exploreService: ExploreService) {}

  // 1. Filter & Sort users
  @Get('users')
  async filterUsers(@Query() filterDto: FilterUsersDto) {
    return this.exploreService.filterUsers(filterDto);
  }

  // 2. View a user profile by ID
  @Get('users/:id')
  async getUserProfile(@Param('id') id: string) {
    return this.exploreService.getUserProfile(id);
  }

  // 3. Send connection request
  @Post('connections/:receiverId')
  async sendConnection(@Param('receiverId') receiverId: string, @Req() req) {
    const senderId = req.user.id; // comes from JWT
    return this.exploreService.sendConnection(senderId, receiverId);
  }
}

import { Controller, Post, Body, Get, Query, Param, UseGuards, Req } from '@nestjs/common';
import { CollabService } from './collab.service';
import { CreateCollabPostDto } from './dto/create-collab-post.dto';
import { FilterCollabPostsDto } from './dto/filter-collab-post.dto';
import { ApplyCollabDto } from './dto/apply-collab-post.dto';
import { JwtGuard } from 'src/auth/jwt.guard';

@Controller('collab')
export class CollabController {
  constructor(private readonly collabService: CollabService) {}

  // 1. Create a new collab post
  @UseGuards(JwtGuard)
  @Post('posts')
  createPost(@Body() dto: CreateCollabPostDto, @Req() req) {
    return this.collabService.createPost(dto, req.user);
  }

  // 2. Browse/filter posts
  @Get('posts')
  findPosts(@Query() filter: FilterCollabPostsDto) {
    return this.collabService.findPosts(filter);
  }

  // 3. Apply to a collab post
  @UseGuards(JwtGuard)
  @Post('posts/:id/apply')
  applyToPost(@Param('id') postId: string, @Body() dto: ApplyCollabDto, @Req() req) {
    return this.collabService.applyToPost(postId, dto, req.user);
  }
}

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CollabPost } from 'libs/db/entities/collab-post.entity';
import { CollabApplication } from 'libs/db/entities/collab-application.entity';
import { CreateCollabPostDto } from './dto/create-collab-post.dto';
import { FilterCollabPostsDto } from './dto/filter-collab-post.dto';
import { ApplyCollabDto } from './dto/apply-collab-post.dto';
import { UserProfile } from 'libs/db/entities/user-profile.entity';

@Injectable()
export class CollabService {
  constructor(
    @InjectRepository(CollabPost)
    private collabPostRepo: Repository<CollabPost>,

    @InjectRepository(CollabApplication)
    private collabAppRepo: Repository<CollabApplication>,
  ) {}

  // 1️⃣ Create a collab post
  async createPost(dto: CreateCollabPostDto, user: UserProfile) {
    const post = this.collabPostRepo.create({
      ...dto,
      creator: user, // assign the user entity directly
    });
    return this.collabPostRepo.save(post);
  }

  // 2️⃣ Browse / filter collab posts
  async findPosts(filter: FilterCollabPostsDto) {
    const query = this.collabPostRepo
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.creator', 'user'); // match entity relation

    // Filter by type/category
    if (filter.category) {
      query.andWhere('post.type = :category', { category: filter.category });
    }

    // Filter by tech stack (Postgres array overlap)
    if (filter.techStacks && filter.techStacks.length > 0) {
      query.andWhere('post.techStack && ARRAY[:...techStacks]', {
        techStacks: filter.techStacks,
      });
    }

    return query.getMany();
  }

  // 3️⃣ Apply to a collab post
  async applyToPost(postId: string, dto: ApplyCollabDto, user: UserProfile) {
    const post = await this.collabPostRepo.findOne({ where: { id: postId } });
    if (!post) throw new NotFoundException('Collab post not found');

    const application = this.collabAppRepo.create({
      message: dto.message,
      applicant: user, // user entity
      post,
    });

    return this.collabAppRepo.save(application);
  }
}

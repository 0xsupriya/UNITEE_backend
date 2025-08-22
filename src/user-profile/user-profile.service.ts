import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { UserProfile } from "libs/db/entities/user-profile.entity";
import { CreateUserProfileDto } from "./dto/create-user-profile.dto";
import { UpdateUserProfileDto } from "./dto/update-user-profile.dto";

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(UserProfile)
    private readonly profileRepo: Repository<UserProfile>
  ) {}

  async createProfile(userId: string, dto: CreateUserProfileDto) {
    // Check if profile already exists
    const existingProfile = await this.profileRepo.findOne({
      where: { user: { id: userId } }
    });

    if (existingProfile) {
      throw new BadRequestException('Profile already exists for this user');
    }

    const profile = this.profileRepo.create({ ...dto, user: { id: userId } });
    return this.profileRepo.save(profile);
  }

  async updateProfile(userId: string, dto: UpdateUserProfileDto) {
  if (!dto || Object.keys(dto).length === 0) {
    throw new BadRequestException('No update fields provided');
  }

  const profile = await this.profileRepo.findOne({
    where: { user: { id: userId } },
    relations: ['user'],
  });

  if (!profile) {
    throw new NotFoundException('Profile not found');
  }

  Object.assign(profile, dto);
  return this.profileRepo.save(profile);
}


  async deleteProfile(userId: string) {
    const result = await this.profileRepo.delete({ user: { id: userId } });
    if (result.affected === 0) throw new NotFoundException("Profile not found");
    return { message: "Profile deleted successfully" };
  }

  async getMyProfile(userId: string) {
    const profile = await this.profileRepo.findOne({
      where: { user: { id: userId } },
      relations: ["user"],
    });

    if (!profile) {
      throw new NotFoundException('Profile not found');
    }

    return profile;
  }

  async getProfileByUserId(userId: string) {
    return this.profileRepo.findOne({
      where: { user: { id: userId } },
      relations: ["user"],
    });
  }
}

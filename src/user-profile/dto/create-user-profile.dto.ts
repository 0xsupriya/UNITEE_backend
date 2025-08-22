import { IsString, IsOptional, IsArray, IsUrl } from 'class-validator';

export class CreateUserProfileDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  bio?: string;

  @IsOptional()
  @IsUrl()
  github?: string;

  @IsOptional()
  @IsUrl()
  linkedin?: string;

  @IsOptional()
  @IsArray()
  techstack?: string[];

  @IsOptional()
  @IsString()
  profilePic?: string;

  @IsOptional()
  @IsString()
  experience?: string;

  @IsOptional()
  @IsString()
  role?: string;
}

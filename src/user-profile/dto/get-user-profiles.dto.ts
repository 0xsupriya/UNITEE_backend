import { IsOptional, IsString, IsArray } from 'class-validator';

export class GetUserProfilesDto {
  @IsOptional()
  @IsString()
  role?: string;

  @IsOptional()
  @IsString()
  experience?: string;

  @IsOptional()
  @IsArray()
  techstack?: string[];

  @IsOptional()
  @IsString()
  sort?: 'recent' | 'most-active' | 'most-connections';
}

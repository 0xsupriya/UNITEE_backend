import { IsOptional, IsString, IsArray, IsIn } from 'class-validator';

export class FilterUsersDto {
  @IsOptional()
  @IsString()
  role?: string;   // e.g., "Frontend Developer"

  @IsOptional()
  @IsString()
  experience?: string; // e.g., "Beginner" | "Intermediate" | "Expert"

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsArray()
  techstack?: string[];  // e.g., ["react", "nodejs"]

  @IsOptional()
  @IsIn(["most_active", "recently_joined", "most_connections"])
  sortBy?: string;
}

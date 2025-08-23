import { IsString, IsOptional, IsArray } from 'class-validator';

export class CreateCollabPostDto {
  @IsString()
  title: string;

  @IsString()
  category: string;   // e.g., "Hackathon", "Startup", "Open Source"

  @IsOptional()
  @IsString()
  applicationLink?: string;

  @IsString()
  overview: string;

  @IsArray()
  @IsString({ each: true })
  requirements: string[];

  @IsArray()
  @IsString({ each: true })
  responsibilities: string[];

  @IsArray()
  @IsString({ each: true })
  techStacks: string[];
}

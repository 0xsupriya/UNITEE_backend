import { IsOptional, IsString, IsArray } from 'class-validator';

export class FilterCollabPostsDto {
  @IsOptional()
  @IsString()
  category?: string;   // e.g., "Hackathon", "Open Source"

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  techStacks?: string[];
}

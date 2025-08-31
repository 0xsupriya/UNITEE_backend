import { IsString } from 'class-validator';

export class ApplyCollabDto {
  @IsString()
  message: string; // Applicant’s message while applying
}

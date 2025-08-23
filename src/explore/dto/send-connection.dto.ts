import { IsNotEmpty, IsUUID } from 'class-validator';

export class SendConnectionDto {
  @IsNotEmpty()
  @IsUUID()
  targetUserId: string; 
}

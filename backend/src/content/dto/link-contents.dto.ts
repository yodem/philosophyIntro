import { IsUUID, IsNotEmpty } from 'class-validator';

export class LinkContentsDto {
  @IsUUID()
  @IsNotEmpty()
  contentId1: string;

  @IsUUID()
  @IsNotEmpty()
  contentId2: string;
}

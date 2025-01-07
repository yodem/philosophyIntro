import { IsString, IsNotEmpty } from 'class-validator';

export class CreateTermDto {
  @IsString()
  @IsNotEmpty()
  term: string;

  @IsString()
  @IsNotEmpty()
  definition: string;
}

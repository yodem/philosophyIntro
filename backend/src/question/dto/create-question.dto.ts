import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsArray,
  IsNumber,
} from 'class-validator';

export class CreateQuestionDto {
  @IsString()
  @IsNotEmpty()
  question: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsArray()
  @IsNumber({}, { each: true })
  @IsOptional()
  terms?: number[];

  @IsArray()
  @IsNumber({}, { each: true })
  @IsOptional()
  philosophers?: number[];
}

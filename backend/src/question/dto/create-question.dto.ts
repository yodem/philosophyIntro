import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsArray,
  IsNumber,
} from 'class-validator';
import { IImages } from '@/term/entities/term.entity';

export class CreateQuestionDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsArray()
  @IsNumber({}, { each: true })
  @IsOptional()
  associatedTerms?: string[];

  @IsArray()
  @IsNumber({}, { each: true })
  @IsOptional()
  associatedPhilosophers?: string[];

  @IsArray()
  @IsNumber({}, { each: true })
  @IsOptional()
  associatedQuestions?: string[];

  @IsOptional()
  images?: IImages;
}

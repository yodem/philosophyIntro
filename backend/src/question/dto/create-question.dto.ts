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
  titleEn: string;

  @IsString()
  @IsNotEmpty()
  titleHe: string;

  @IsString()
  @IsNotEmpty()
  contentEn: string;

  @IsString()
  @IsNotEmpty()
  contentHe: string;

  @IsArray()
  @IsNumber({}, { each: true })
  @IsOptional()
  relatedTerms?: number[];

  @IsArray()
  @IsNumber({}, { each: true })
  @IsOptional()
  relatedPhilosophers?: number[];

  @IsArray()
  @IsNumber({}, { each: true })
  @IsOptional()
  relatedQuestions?: number[];
}

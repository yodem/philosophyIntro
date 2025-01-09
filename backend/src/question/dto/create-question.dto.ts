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
  title: string;

  @IsString()
  @IsNotEmpty()
  content: string;

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

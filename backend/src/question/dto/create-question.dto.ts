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
  associatedTerms?: string[];

  @IsArray()
  @IsNumber({}, { each: true })
  @IsOptional()
  associatedPhilosophers?: string[];

  @IsArray()
  @IsNumber({}, { each: true })
  @IsOptional()
  associatedQuestions?: string[];
}

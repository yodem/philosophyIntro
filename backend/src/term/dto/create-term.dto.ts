import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsArray,
  IsNumber,
} from 'class-validator';

export class CreateTermDto {
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
  relatedQuestions?: number[];

  @IsArray()
  @IsNumber({}, { each: true })
  @IsOptional()
  relatedPhilosophers?: number[];
}

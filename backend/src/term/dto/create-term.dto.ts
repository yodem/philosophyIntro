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
  relatedQuestions?: number[];

  @IsArray()
  @IsNumber({}, { each: true })
  @IsOptional()
  relatedPhilosophers?: number[];
}

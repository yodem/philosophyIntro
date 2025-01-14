import { IsString, IsNotEmpty, IsOptional, IsArray } from 'class-validator';
import { IImages } from '../entities/term.entity';

export class CreateTermDto {
  id: string;
  images?: IImages;

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
  @IsString({ each: true })
  @IsOptional()
  associatedCategories?: string[];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  associatedPhilosophers?: string[];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  associatedTerms?: string[];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  associatedQuestions?: string[];
}

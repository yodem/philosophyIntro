import { IsString, IsNotEmpty, IsOptional, IsArray } from 'class-validator';
import { IImages } from '../../term/entities/term.entity';

export class CreatePhilosopherDto {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsOptional()
  images?: IImages;

  @IsString()
  @IsOptional()
  birthDate?: string;

  @IsString()
  @IsOptional()
  deathDate?: string;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsOptional()
  era?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  associatedTerms?: string[];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  associatedPhilosophers?: string[];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  associatedQuestions?: string[];
}

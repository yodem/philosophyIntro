import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsArray,
  IsNumber,
} from 'class-validator';

export class CreatePhilosopherDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsNumber()
  @IsOptional()
  birthYear?: number;

  @IsNumber()
  @IsOptional()
  deathYear?: number;

  @IsArray()
  @IsNumber({}, { each: true })
  @IsOptional()
  terms?: number[];

  @IsArray()
  @IsNumber({}, { each: true })
  @IsOptional()
  questions?: number[];
}

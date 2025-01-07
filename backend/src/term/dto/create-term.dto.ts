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
  term: string;

  @IsString()
  @IsNotEmpty()
  definition: string;

  @IsArray()
  @IsNumber({}, { each: true })
  @IsOptional()
  questions?: number[];

  @IsArray()
  @IsNumber({}, { each: true })
  @IsOptional()
  philosophers?: number[];
}

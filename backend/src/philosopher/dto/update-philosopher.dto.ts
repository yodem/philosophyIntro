import { PartialType } from '@nestjs/mapped-types';
import { CreatePhilosopherDto } from './create-philosopher.dto';

export class UpdatePhilosopherDto extends PartialType(CreatePhilosopherDto) {}

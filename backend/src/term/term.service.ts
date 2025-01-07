import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindManyOptions, Like, In } from 'typeorm';
import { CreateTermDto } from './dto/create-term.dto';
import { UpdateTermDto } from './dto/update-term.dto';
import { Term } from './entities/term.entity';

@Injectable()
export class TermService {
  constructor(
    @InjectRepository(Term)
    private termRepository: Repository<Term>,
  ) {}

  async create(createTermDto: CreateTermDto): Promise<Term> {
    const term = this.termRepository.create(createTermDto);
    return this.termRepository.save(term);
  }

  findAll(
    search?: string,
    page?: number,
    limit?: number,
    period?: string[],
    affiliation?: string[],
  ): Promise<Term[]> {
    const options: FindManyOptions<Term> = {};
    const where: any = {};
    if (search) {
      where.term = Like(`%${search}%`);
    }
    if (period && period.length > 0) {
      where.philosophicalPeriod = In(period);
    }
    if (affiliation && affiliation.length > 0) {
      where.philosophicalAffiliation = In(affiliation);
    }
    options.where = where;
    if (page && limit) {
      options.skip = (page - 1) * limit;
      options.take = limit;
    }
    return this.termRepository.find(options);
  }

  async findOne(id: number): Promise<Term> {
    const term = await this.termRepository.findOne({ where: { id } });
    if (!term) {
      throw new Error(`Term with ID ${id} not found`);
    }
    return term;
  }

  async update(id: number, updateTermDto: UpdateTermDto): Promise<Term> {
    await this.termRepository.update({ id }, updateTermDto);
    const updatedTerm = await this.termRepository.findOne({ where: { id } });
    if (!updatedTerm) {
      throw new Error(`Term with ID ${id} not found`);
    }
    return updatedTerm;
  }

  async remove(id: number): Promise<void> {
    await this.termRepository.delete(id);
  }
}

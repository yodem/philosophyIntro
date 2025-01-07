import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindManyOptions, Like, In } from 'typeorm';
import { CreatePhilosopherDto } from './dto/create-philosopher.dto';
import { UpdatePhilosopherDto } from './dto/update-philosopher.dto';
import { Philosopher } from './entities/philosopher.entity';

@Injectable()
export class PhilosopherService {
  constructor(
    @InjectRepository(Philosopher)
    private philosopherRepository: Repository<Philosopher>,
  ) {}

  async create(
    createPhilosopherDto: CreatePhilosopherDto,
  ): Promise<Philosopher> {
    const philosopher = this.philosopherRepository.create(createPhilosopherDto);
    return this.philosopherRepository.save(philosopher);
  }

  findAll(
    search?: string,
    page?: number,
    limit?: number,
    period?: string[],
    affiliation?: string[],
  ): Promise<Philosopher[]> {
    const options: FindManyOptions<Philosopher> = {};
    const where: any = {};
    if (search) {
      where.name = Like(`%${search}%`);
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
    return this.philosopherRepository.find(options);
  }

  async findOne(id: number): Promise<Philosopher> {
    const philosopher = await this.philosopherRepository.findOne({
      where: { id },
    });
    if (!philosopher) {
      throw new Error(`Philosopher with ID ${id} not found`);
    }
    return philosopher;
  }

  async update(
    id: number,
    updatePhilosopherDto: UpdatePhilosopherDto,
  ): Promise<Philosopher> {
    await this.philosopherRepository.update({ id }, updatePhilosopherDto);
    const updatedPhilosopher = await this.philosopherRepository.findOne({
      where: { id },
    });
    if (!updatedPhilosopher) {
      throw new Error(`Philosopher with ID ${id} not found`);
    }
    return updatedPhilosopher;
  }

  async remove(id: number): Promise<void> {
    await this.philosopherRepository.delete(id);
  }
}

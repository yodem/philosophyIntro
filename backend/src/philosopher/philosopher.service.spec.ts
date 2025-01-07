import { Test, TestingModule } from '@nestjs/testing';
import { PhilosopherService } from './philosopher.service';

describe('PhilosopherService', () => {
  let service: PhilosopherService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PhilosopherService],
    }).compile();

    service = module.get<PhilosopherService>(PhilosopherService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

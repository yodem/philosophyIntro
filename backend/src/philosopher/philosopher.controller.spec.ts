import { Test, TestingModule } from '@nestjs/testing';
import { PhilosopherController } from './philosopher.controller';
import { PhilosopherService } from './philosopher.service';

describe('PhilosopherController', () => {
  let controller: PhilosopherController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PhilosopherController],
      providers: [PhilosopherService],
    }).compile();

    controller = module.get<PhilosopherController>(PhilosopherController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

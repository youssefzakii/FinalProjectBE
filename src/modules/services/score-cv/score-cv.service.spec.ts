import { Test, TestingModule } from '@nestjs/testing';
import { ScoreCvService } from './score-cv.service';

describe('ScoreCvService', () => {
  let service: ScoreCvService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ScoreCvService],
    }).compile();

    service = module.get<ScoreCvService>(ScoreCvService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

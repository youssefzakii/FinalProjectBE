import { Test, TestingModule } from '@nestjs/testing';
import { HandleCvService } from './handle-cv.service';

describe('HandleCvService', () => {
  let service: HandleCvService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HandleCvService],
    }).compile();

    service = module.get<HandleCvService>(HandleCvService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

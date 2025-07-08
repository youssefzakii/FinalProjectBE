import { Test, TestingModule } from '@nestjs/testing';
import { ScoreCvController } from './score-cv.controller';

describe('ScoreCvController', () => {
  let controller: ScoreCvController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ScoreCvController],
    }).compile();

    controller = module.get<ScoreCvController>(ScoreCvController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

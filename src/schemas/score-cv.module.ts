import { Module } from '@nestjs/common';
import { ScoreCvService } from '../modules/services/score-cv/score-cv.service';
import { ScoreCvController } from '../modules/CV/score-cv/score-cv.controller';

@Module({
  providers: [ScoreCvService],
  controllers: [ScoreCvController],
})
export class ScoreCvModule {} 
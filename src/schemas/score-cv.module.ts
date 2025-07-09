// src/schemas/score-cv.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CvScore, CvScoreSchema } from './cv-score.schema';
import { ScoreCvService } from '../modules/services/score-cv/score-cv.service';
import { ScoreCvController } from '../modules/CV/score-cv/score-cv.controller';
import { ResourcesModule } from 'src/modules/resources/resources.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: CvScore.name, schema: CvScoreSchema }]),
    ResourcesModule,
  ],
  providers: [ScoreCvService],
  controllers: [ScoreCvController],
})
export class ScoreCvModule {}
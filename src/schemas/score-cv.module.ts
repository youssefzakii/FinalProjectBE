// src/schemas/score-cv.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CvScore, CvScoreSchema } from './cv-score.schema';
import { UserSchema, User } from './user.schema';
import { ScoreCvService } from '../modules/services/score-cv/score-cv.service';
import { ScoreCvController } from '../modules/CV/score-cv/score-cv.controller';
import { ResourcesModule } from 'src/modules/resources/resources.module';
import { JobService } from 'src/modules/services/job-service';
import { JobModule } from 'src/modules/job/job.module';
import { CompanyModule } from 'src/modules/company/company.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: CvScore.name, schema: CvScoreSchema },
    {name: User.name, schema: UserSchema}
    ]),
    ResourcesModule,
    JobModule,
    CompanyModule
  ],
  providers: [ScoreCvService],
  controllers: [ScoreCvController],
})
export class ScoreCvModule {}
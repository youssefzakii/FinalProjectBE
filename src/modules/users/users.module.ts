import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.services';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/schemas/user.schema';
import { CvScore, CvScoreSchema } from 'src/schemas/cv-score.schema';
import { JobDescription, JobDescriptionSchema } from 'src/schemas/job-description';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: CvScore.name, schema: CvScoreSchema },
      { name: JobDescription.name, schema: JobDescriptionSchema }
    ]),
  ],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}

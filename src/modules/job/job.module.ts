import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JobService } from '../services/job-service';
import { JobController } from './job.controller';
import { JobDescription, JobDescriptionSchema } from 'src/schemas/job-description';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: JobDescription.name, schema: JobDescriptionSchema },
    ]),
  ],
  controllers: [JobController],
  providers: [JobService],
})
export class JobModule {}

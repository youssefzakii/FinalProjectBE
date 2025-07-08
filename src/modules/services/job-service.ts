import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JobDescription, JobDescriptionDocument } from 'src/schemas/job-description';
import { CreateJobDto } from '../auth/dto/create-job.dto';

@Injectable()
export class JobService {
  constructor(
    @InjectModel(JobDescription.name) private jobModel: Model<JobDescriptionDocument>,
  ) {}

  async getAllJobs() {
    return this.jobModel.find().populate('company');
  }

  async addJob(dto: CreateJobDto) {
    return this.jobModel.create(dto);
  }
}

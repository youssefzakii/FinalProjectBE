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
  
  async getAllJobsByCompany(id: string) {
    return this.jobModel.find({ company: id });
  }

  async addJob(dto: CreateJobDto) {
    console.log(dto);
    return this.jobModel.create(dto);
  }

  async getJobById(id: string) {
    return this.jobModel.findById(id).populate('company');
  }

  // Check if user can modify this job (admin or owner company)
  async canModifyJob(jobId: string, userId: string, userRole: string): Promise<boolean> {
    if (userRole === 'admin') return true;
    
    const job = await this.jobModel.findById(jobId);
    return job && job.company.toString() === userId || false;
  }

  // Update job with permission check
  async updateJobById(id: string, updateDto: Partial<JobDescription>, userId: string, userRole: string) {
    const canModify = await this.canModifyJob(id, userId, userRole);
    if (!canModify) {
      throw new Error('Unauthorized: You can only modify your own job posts');
    }
    
    return this.jobModel.findByIdAndUpdate(id, updateDto, { new: true }).populate('company');
  }

  // Delete job with permission check
  async deleteJobById(id: string, userId: string, userRole: string) {
    const canModify = await this.canModifyJob(id, userId, userRole);
    if (!canModify) {
      throw new Error('Unauthorized: You can only delete your own job posts');
    }
    
    return this.jobModel.findByIdAndDelete(id);
  }

  // Get job by ID with ownership check
  async getJobByIdWithOwnership(id: string, userId: string, userRole: string) {
    const job = await this.jobModel.findById(id).populate('company');
    if (!job) {
      throw new Error('Job not found');
    }
    
    const canAccess = userRole === 'admin' || job.company.toString() === userId;
    if (!canAccess) {
      throw new Error('Unauthorized: You can only access your own job posts');
    }
    
    return job;
  }
}

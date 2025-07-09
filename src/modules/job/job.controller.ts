import { Controller, Get, Post, Body, Req } from '@nestjs/common';
import { JobService } from '../services/job-service';
import { CreateJobDto } from '../auth/dto/create-job.dto';
import { ForbiddenException } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { Request } from 'express';


@ApiTags('Jobs')
@Controller('jobs')
export class JobController {
  constructor(private readonly jobService: JobService) {}

  @ApiBearerAuth()
  @Get()
  
  @ApiOperation({ summary: 'Get all job descriptions' })
  @ApiResponse({
    status: 200,
    description: 'Returns a list of all job descriptions',
    schema: {
      example: [
        {
          _id: '64ae97abc123',
          title: 'Backend Developer',
          description: 'Build APIs using NestJS and MongoDB',
          company: 'TechSoft',
        },
      ],
    },
  })
  getAll( @Req() req: Request) {
    console.log(req['user']);
    const admin = req['user']?.role;
    console.log(admin);
    if (admin !== 'admin')
    {
        throw new ForbiddenException('Unauthorized');
    }
    return this.jobService.getAllJobs();
  }
  @ApiBearerAuth()
  @Post()
  @ApiOperation({ summary: 'Create a new job description' })
  @ApiBody({
    type: CreateJobDto,
    description: 'Job title and description',
    examples: {
      example1: {
        summary: 'Typical job posting',
        value: {
          title: 'Full Stack Developer',
          description: 'Work with React and NestJS',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'The newly created job description',
    schema: {
      example: {
        _id: '64ae97abc123',
        title: 'Full Stack Developer',
        description: 'Work with React and NestJS',
        company: 'companyId123',
      },
    },
  })
  create(@Body() dto: CreateJobDto, @Req() req: Request) {
    const companyId = req['user']?.id;
    const payloadWithCompany = { ...dto, company: companyId };
    return this.jobService.addJob(payloadWithCompany);
  }
}

import { Controller, Get, Post, Body, Req, Param, Put, Delete } from '@nestjs/common';
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
import { UpdateJobDto } from '../../schemas/dto/update-job.dto';


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
    console.log(dto);
    const payloadWithCompany = { ...dto, company: companyId };
    return this.jobService.addJob(payloadWithCompany);
  }

  @ApiBearerAuth()
  @Get('admin/:id')
  getJobById(@Param('id') id: string, @Req() req: Request) {
    if (req['user']?.role !== 'admin') throw new ForbiddenException('Unauthorized');
    return this.jobService.getJobById(id);
  }
  @ApiBearerAuth()
  @Get('company')
  getAllJobsByCompany(@Req() req: Request) {
    const companyId = req['user']?.id;
    if (!companyId) throw new ForbiddenException('Unauthorized');
    return this.jobService.getAllJobsByCompany(companyId);
  }

  @ApiBearerAuth()
  @Get(':id')
  @ApiOperation({ summary: 'Get a specific job by ID (Admin or Owner Company)' })
  @ApiResponse({
    status: 200,
    description: 'Returns the job description',
  })
  getJobByIdWithOwnership(@Param('id') id: string, @Req() req: Request) {
    const userId = req['user']?.id;
    const userRole = req['user']?.role;
    return this.jobService.getJobByIdWithOwnership(id, userId, userRole);
  }

  @ApiBearerAuth()
  @Put(':id')
  @ApiOperation({ summary: 'Update a job description (Admin or Owner Company)' })
  @ApiBody({
    type: UpdateJobDto,
    description: 'Job update data',
  })
  @ApiResponse({
    status: 200,
    description: 'Job updated successfully',
  })
  updateJobById(@Param('id') id: string, @Body() updateDto: UpdateJobDto, @Req() req: Request) {
    const userId = req['user']?.id;
    const userRole = req['user']?.role;
    return this.jobService.updateJobById(id, updateDto, userId, userRole);
  }

  @ApiBearerAuth()
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a job description (Admin or Owner Company)' })
  @ApiResponse({
    status: 200,
    description: 'Job deleted successfully',
  })
  deleteJobById(@Param('id') id: string, @Req() req: Request) {
    const userId = req['user']?.id;
    const userRole = req['user']?.role;
    return this.jobService.deleteJobById(id, userId, userRole);
  }
  
}

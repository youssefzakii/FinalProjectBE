import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  Body,
  HttpException,
  HttpStatus,
  Req,
  Get,
  Param,
  Patch,
  Delete,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { ScoreCvService } from "../../services/score-cv/score-cv.service";
import { saveResource } from "src/common/utlities/utlities";
import { ApiBearerAuth, ApiBody, ApiResponse } from "@nestjs/swagger";
import { ResourcesService } from "src/modules/resources/resources.service";
import { UpdateCvScoreDto } from "src/schemas/dto/update-cv-score.dto";
import { CreateJobDto } from "src/modules/auth/dto/create-job.dto";
import { JobService } from "src/modules/services/job-service";
import { CompanyService } from "src/modules/company/company.service";
import { JobDescriptionSchema, JobDescriptionDocument, JobDescription } from 'src/schemas/job-description';
import { Model } from 'mongoose';
import { InjectModel } from "@nestjs/mongoose";
@Controller("score-cv")
export class ScoreCvController {
  constructor(
    private readonly scoreCvService: ScoreCvService,
    private readonly resourceService: ResourcesService,
    private readonly jobservice: JobService,
    private readonly companyService: CompanyService,
    @InjectModel(JobDescription.name)
    private readonly jobModel: Model<JobDescriptionDocument>
  ) {}

  @Post("analyze")
  @UseInterceptors(FileInterceptor("cvFile"))
  async analyzeCv(
    @UploadedFile() file: Express.Multer.File,
    @Body("jobDescription") jobDescription: string
  ) {
    if (!file || !jobDescription) {
      throw new HttpException("File and jobDescription are required", HttpStatus.BAD_REQUEST);
    }
    const result = await this.scoreCvService.analyzeCV(file, jobDescription);
    return result;
  }

  @ApiBearerAuth()
  @Post("analyze-auth")
  @UseInterceptors(FileInterceptor("cvFile"))
  async analyzeCvAuth(
    @UploadedFile() file: Express.Multer.File,
    @Body("jobDescription") jobDescription: string,
    @Req() req
  ) {
    const user = req["user"];
    if (!user) {
      throw new HttpException("Unauthorized", HttpStatus.UNAUTHORIZED);
    }
    if (!file || !jobDescription) {
      throw new HttpException("File and jobDescription are required", HttpStatus.BAD_REQUEST);
    }
    const result = await this.scoreCvService.analyzeCV(file, jobDescription);

    if (result.error == true) {
      throw new HttpException(result.message, HttpStatus.BAD_REQUEST);
    } else {
      const cvFileUrl = await saveResource(
        file.buffer,
        user.username,
        "resume",
        this.resourceService
      );

      const pdf = await import("pdf-parse");
      const pdfData = await pdf(file.buffer);

      await this.scoreCvService.saveScore({
        userId: user.id,
        username: user.username,
        cvText: pdfData.text,
        jobDescription,
        jobSection: user.Fields || [],
        scoreResult: result,
        cvFileUrl,
      });
    }
    return result;
  }

  @Get("user/:userId")
  @ApiBearerAuth()
  async getUserCvScores(@Param("userId") userId: string, @Req() req) {
    const user = req["user"];
    if (!user) {
      throw new HttpException("Unauthorized", HttpStatus.UNAUTHORIZED);
    }
    // Allow if admin or the user himself
    if (user.role === "admin" || user.id === userId) {
      return this.scoreCvService.getScoresByUserId(userId);
    } else {
      throw new HttpException("Forbidden", HttpStatus.FORBIDDEN);
    }
  }
  @ApiBearerAuth()
  @Post('get-candidate')
  @ApiBody({
    type: CreateJobDto,
    examples: {
      example1: {
        summary: 'Example job request',
        value: {
          title: 'Backend Developer',
          description: 'We are looking for a c++ dev.',
          approved: true,
          fields: ['NodeJS', 'Express', 'MongoDB'],
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Returns list of top matched candidates',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          cvId: { type: 'string' },
          userId: { type: 'string' },
          geminiScore: { type: 'number' },
          username: { type: 'string' },
          email: { type: 'string' },
          Fields: {
            type: 'array',
            items: { type: 'string' },
          },
          cvFileUrl: {
            type: 'string',
            example: 'https:\\93eb4da4-0e0f-4025.pdf'
          }
        },
      },
    },
  })
  async getCandidate(@Body() jobDescription: CreateJobDto, @Req() req) {
    const companyId = req.user?.id;
    if (!companyId) throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
  
    const company = await this.companyService.getCompanyById(companyId);
    if (!company) throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);

    const job = await this.jobModel.create({
      ...jobDescription,
      company: companyId,
    });

    const candidates = await this.scoreCvService.getCan(jobDescription); // still use CreateJobDto here
  
    await this.jobModel.findByIdAndUpdate(job._id, {
      $set: { candidates: candidates },
    });
  
    return candidates;
  }
  

  @Get("admin/all")
  @ApiBearerAuth()
  async getAllCvScores(@Req() req) {
    const user = req["user"];
    if (!user || user.role !== "admin") {
      throw new HttpException("Forbidden", HttpStatus.FORBIDDEN);
    }
    return this.scoreCvService.getAllScores();
  }

  @Get("admin/:cvId")
  @ApiBearerAuth()
  async getCvScoreById(@Param("cvId") cvId: string, @Req() req) {
    const user = req["user"];
    if (!user || user.role !== "admin") {
      throw new HttpException("Forbidden", HttpStatus.FORBIDDEN);
    }
    return this.scoreCvService.getScoreById(cvId);
  }

  @Patch("admin/:cvId")
  @ApiBearerAuth()
  async updateCvScoreById(
    @Param("cvId") cvId: string,
    @Body() updateDto: UpdateCvScoreDto,
    @Req() req
  ) {
    const user = req["user"];
    if (!user || user.role !== "admin") {
      throw new HttpException("Forbidden", HttpStatus.FORBIDDEN);
    }
    return this.scoreCvService.updateScoreById(cvId, updateDto);
  }

  @Delete("admin/:cvId")
  @ApiBearerAuth()
  async deleteCvScoreById(@Param("cvId") cvId: string, @Req() req) {
    const user = req["user"];
    if (!user || user.role !== "admin") {
      throw new HttpException("Forbidden", HttpStatus.FORBIDDEN);
    }
    return this.scoreCvService.deleteScoreById(cvId);
  }
}
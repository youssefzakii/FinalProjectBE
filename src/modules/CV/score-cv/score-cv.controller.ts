import { Controller, Post, UploadedFile, UseInterceptors, Body, HttpException, HttpStatus } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ScoreCvService } from '../../services/score-cv/score-cv.service';

@Controller('score-cv')
export class ScoreCvController {
  constructor(private readonly scoreCvService: ScoreCvService) {}

  @Post('analyze')
  @UseInterceptors(FileInterceptor('cvFile'))
  async analyzeCv(
    @UploadedFile() file: Express.Multer.File,
    @Body('jobDescription') jobDescription: string
  ) {
    if (!file || !jobDescription) {
      throw new HttpException('File and jobDescription are required', HttpStatus.BAD_REQUEST);
    }
    const result = await this.scoreCvService.analyzeCV(file, jobDescription);
    return result;
  }
} 
import {
  Controller,
  Post,
  Get,
  UploadedFile,
  UseInterceptors,
  Req,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { HandleCvService } from 'src/modules/services/handle-cv/handle-cv.service';
import { Request } from 'express';

@Controller('cv')
export class CvController {
  constructor(private readonly handleCvService: HandleCvService) {}

  @Get('test')
  async test() {
    return 'CV Module is working!';
  }
  @Get('getCvs')
  async getCvs(@Req() req: Request) {
    const username = req['user']?.username;
    if (!username) {
      throw new Error('User ID not found in token');
    }

    return this.handleCvService.getUserCvs(username);
  }
  @Post('analyze')
  @UseInterceptors(FileInterceptor('file'))
  async analyze(@UploadedFile() file, @Req() req: Request) {
    const username = req['user']?.username;
    if (!username) {
      throw new Error('User ID not found in token');
    }

    return this.handleCvService.analyzeResume(file, username);
  }
}

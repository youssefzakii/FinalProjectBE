import {
    Controller,
    Post,
    Get,
    UploadedFile,
    UseInterceptors,
  } from '@nestjs/common';
  import { FileInterceptor } from '@nestjs/platform-express';
  import { HandleCvService } from 'src/modules/services/handle-cv/handle-cv.service';
  
  @Controller('cv')
  export class CvController {
    constructor(private readonly handleCvService: HandleCvService) {}
    @Get('test')
    async test() {
      return 'CV Module is working!';
    }
    
    @Post('analyze')
    @UseInterceptors(FileInterceptor('file'))
    async analyze(@UploadedFile() file) {
      return this.handleCvService.analyzeResume(file);
    }
  }
  
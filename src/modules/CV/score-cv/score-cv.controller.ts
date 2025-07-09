import { Controller, Post, UploadedFile, UseInterceptors, Body, HttpException, HttpStatus, Req } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ScoreCvService } from '../../services/score-cv/score-cv.service';
import { saveResource } from 'src/common/utlities/utlities';
import { ApiBearerAuth } from '@nestjs/swagger';
import { ResourcesService } from 'src/modules/resources/resources.service';
@Controller('score-cv')
export class ScoreCvController {
  constructor(private readonly scoreCvService: ScoreCvService, private readonly resourceService: ResourcesService) {}

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
@ApiBearerAuth()
@Post('analyze-auth')
  @UseInterceptors(FileInterceptor('cvFile'))
  async analyzeCvAuth(
    @UploadedFile() file: Express.Multer.File,
    @Body('jobDescription') jobDescription: string,
    // @Body('jobSection') jobSection: string,
    @Req() req
  ) {
    const user = req['user'];
    if (!user) {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }
    if (!file || !jobDescription) {
      throw new HttpException('File and jobDescription are required', HttpStatus.BAD_REQUEST);
    }
    const result = await this.scoreCvService.analyzeCV(file, jobDescription);

    if(result.error==true) {
      throw new HttpException(result.message, HttpStatus.BAD_REQUEST);
      
    }else{
    const cvFileUrl = await saveResource(
      file.buffer,
      user.username,
      'resume',
      this.resourceService
    );

    const pdf = await import('pdf-parse');
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

}

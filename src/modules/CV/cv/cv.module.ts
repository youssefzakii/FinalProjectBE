import { Module } from '@nestjs/common';
import { CvController } from './cv.controller';
import { HandleCvService } from 'src/modules/services/handle-cv/handle-cv.service';

@Module({
  controllers: [CvController],
  providers: [HandleCvService]
})
export class CvModule {}
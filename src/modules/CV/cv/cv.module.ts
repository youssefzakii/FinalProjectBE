import { Module } from '@nestjs/common';
import { CvController } from './cv.controller';
import { HandleCvService } from 'src/modules/services/handle-cv/handle-cv.service';
import { ResourcesService } from 'src/modules/resources/resources.service';
import { ResourcesModule } from 'src/modules/resources/resources.module';

@Module({
  controllers: [CvController],
  providers: [HandleCvService, ResourcesService],
  imports: [ResourcesModule]
})
export class CvModule {}
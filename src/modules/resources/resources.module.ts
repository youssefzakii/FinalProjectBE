import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ResourcesService } from './resources.service';
import { Resource, ResourceSchema } from 'src/schemas/media.schema';
import * as fs from 'fs';
import * as path from 'path';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Resource.name, schema: ResourceSchema },
    ]),
  ],
  providers: [ResourcesService],
  exports: [ResourcesService,
    MongooseModule
  ], 
})
export class ResourcesModule {}

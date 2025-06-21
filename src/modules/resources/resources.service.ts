import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Resource, ResourceDocument } from 'src/schemas/media.schema';
import { CreateResourceDto } from '../auth/dto/create-resources.dto';
import fs from 'fs';

@Injectable()

export class ResourcesService {
  constructor(@InjectModel(Resource.name) private model: Model<ResourceDocument>) {}

  async create(dto: CreateResourceDto): Promise<Resource> {
    return this.model.create(dto);
  }

  async findAllByUser(username: string): Promise<Resource[]> {
    return this.model.find({ username });
  }

  async findOne(id: string): Promise<Resource> {
    const resource = await this.model.findById(id);
    if (!resource) throw new NotFoundException('Resource not found');
    return resource;
  }

  async delete(id: string): Promise<void> {
    const res = await this.model.findByIdAndDelete(id);
    if (!res) throw new NotFoundException('Resource not found');
  }
}


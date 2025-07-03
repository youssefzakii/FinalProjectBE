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
import { ApiBearerAuth, ApiOperation, ApiOkResponse, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { Resource } from 'src/schemas/media.schema';
import { ResourceDto } from 'src/modules/auth/dto/resource.dto';

@ApiBearerAuth()
@Controller('cv')
export class CvController {
  constructor(private readonly handleCvService: HandleCvService) {}

  @Get('test')
  async test(@Req() req: Request) {
    const username = req['user']?.username;
    console.log(req['user']);
    return 'CV Module is working!';
  }
  @Get('getCvs')
  @ApiOperation({ summary: 'Get all CVs for the authenticated user' })
  @ApiOkResponse({
    description: 'List of CV resources for the user',
    type: ResourceDto,
    isArray: true,
  })
  async getCvs(@Req() req: Request) {
    const username = req['user']?.username;
    if (!username) {
      throw new Error('User ID not found in token');
    }

    return this.handleCvService.getUserCvs(username);
  }
  @Post('analyze')
  @ApiOperation({ summary: 'Analyze a CV PDF and generate feedback and questions' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'PDF file to analyze',
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiOkResponse({
    description: 'Analysis result as JSON',
    schema: {
      example: {
        "missing parts": "The CV is missing a dedicated section for awards, certifications, and specific achievements within projects.",
        "tests": [
          {
            "C++": [
              {
                "content": "What is the primary use case for pointers in C++?",
                "choices": [
                  "a. Storing memory addresses",
                  "b. Performing arithmetic operations",
                  "c. Defining data types"
                ],
                "correct answer": "a"
              }
            ]
          }
        ],
        "syntax problems": [
          "Missing period at the end of the first sentence in the profile section.",
          "In the profile section: 'NodeJs' should be 'Node.js'."
        ]
      }
    }
  })
  @UseInterceptors(FileInterceptor('file'))
  async analyze(@UploadedFile() file, @Req() req: Request) {
    const username = req['user']?.username;
    
    if (!username) {
      throw new Error('User ID not found in token');
    }

    return this.handleCvService.analyzeResume(file, username);
  }
}

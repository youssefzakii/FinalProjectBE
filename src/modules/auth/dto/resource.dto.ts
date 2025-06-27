import { ApiProperty } from '@nestjs/swagger';

export class ResourceDto {
  @ApiProperty({ example: 'My Resume', description: 'Title of the resource' })
  title: string;

  @ApiProperty({ example: 'output/1234abcd.pdf', description: 'URL or path to the resource file' })
  url: string;

  @ApiProperty({ example: 'resume', description: 'Type of the resource' })
  type: string;

  @ApiProperty({ example: '2024-06-21T12:34:56.789Z', description: 'Creation date' })
  createdAt: Date;

  @ApiProperty({ example: 'Ahmed', description: 'Username of the owner' })
  username: string;
}

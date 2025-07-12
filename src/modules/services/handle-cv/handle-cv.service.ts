import { Injectable } from '@nestjs/common';
import * as pdf from 'pdf-parse';
import * as fs from 'fs/promises';
import * as fsSync from 'fs';
import { GoogleGenAI } from '@google/genai';
import { Express } from 'express';
import { ResourcesService } from 'src/modules/resources/resources.service';
import { v4 as uuidv4 } from 'uuid';
import * as path from 'path';
import { saveResource } from 'src/common/utlities/utlities';
@Injectable()
export class HandleCvService {
  private agent: GoogleGenAI;
  private promptPath: string = 'src/modules/CV/cv/prompt.txt';

  constructor(private resourceService: ResourcesService) {
    this.agent = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }
  async getUserCvs(username: string): Promise<any[]> {
    try {
      const resources = await this.resourceService.findAllByUser(username);
      const cvFiles = resources
        .filter(resource => resource.type === 'resume');
      return cvFiles;
    } catch (error) {
      console.error('Error fetching CVs:', error);
      throw error;
    }
  }
  async analyzeResume(uploadedFile: Express.Multer.File, username: string): Promise<string>
{
  try
  {
    const pdfData = await pdf(uploadedFile.buffer);
    const resumeText = pdfData.text;

    const prompt = await fs.readFile(this.promptPath, 'utf-8');
    const finalPrompt = `${prompt}\n\n${resumeText}`;

    const response = await this.agent.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: finalPrompt,
      config: { responseMimeType: 'text/plain' },
    });

    const resultText = response.text ?? '[No response text]';
    await saveResource(
      uploadedFile.buffer,
      username,
      'resume',
      this.resourceService
    );
    await saveResource(
      resultText,
      username,
      'result',
      this.resourceService
    );
    console.log(resultText);
    const data = JSON.parse(
      resultText.replace(/```json\s*/g, '').replace(/```/g, '').trim()
    );
    console.log("-----------------------\n-------------------\n")
    //console.log(data['tests']);
    return data;
  }
  catch (error)
  {
    console.error('Error analyzing resume:', error);
    throw error;
  }
}
}


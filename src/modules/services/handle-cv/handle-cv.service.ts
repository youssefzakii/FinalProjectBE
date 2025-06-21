import { Injectable } from '@nestjs/common';
import * as pdf from 'pdf-parse';
import * as fs from 'fs/promises';
import * as fsSync from 'fs';
import { GoogleGenAI } from '@google/genai';
import { Express } from 'express';
import { ResourcesService } from 'src/modules/resources/resources.service';
import { v4 as uuidv4 } from 'uuid';
import * as path from 'path';

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
  async analyzeResume(uploadedFile: Express.Multer.File, username: string): Promise<string> {
    try {
      const pdfData = await pdf(uploadedFile.buffer);
      const resumeText = pdfData.text;

      const prompt = await fs.readFile(this.promptPath, 'utf-8');
      const finalPrompt = `${prompt}\n\n${resumeText}`;
      const response = await this.agent.models.generateContent({
        model: 'gemini-2.0-flash',
        contents: finalPrompt,
        config: {
          responseMimeType: 'text/plain',
        },
      });

      const resultText = response.text ?? '[No response text]';

      const outputDir = 'output';
      const fileName = `${uuidv4()}.txt`;
      const filePath = path.join(outputDir, fileName);

      if (!fsSync.existsSync(outputDir)) {
        await fs.mkdir(outputDir, { recursive: true });
      }
      const pdfFileName = `${uuidv4()}.pdf`;
      const pdfPath = path.join(outputDir, pdfFileName);
      await fs.writeFile(pdfPath, uploadedFile.buffer);
      await this.resourceService.create({
        username,
        title: uploadedFile.originalname,
        url: pdfPath,
        type: 'resume',
      });
      await fs.writeFile(filePath, resultText);

      await this.resourceService.create({
        username,
        title: uploadedFile.originalname,
        url: filePath,
        type: 'result',
      });

      return resultText;
    } catch (error) {
      console.error('Error analyzing resume:', error);
      throw error;
    }
  }
}

import { Injectable } from '@nestjs/common';
import * as pdf from 'pdf-parse';
import * as fs from 'fs/promises';
import { GoogleGenAI } from '@google/genai';
import {Express} from 'express';
@Injectable()
export class HandleCvService {
  private agent: GoogleGenAI
  private promptPath: string = "src/modules/CV/cv/prompt.txt";
  constructor() {
    this.agent = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }

  async analyzeResume(uploadedFile: Express.Multer.File): Promise<string> {
    try {
      const pdfData = await pdf(uploadedFile.buffer);
      const resumeText = pdfData.text;

      const prompt = await fs.readFile(this.promptPath, 'utf-8');
      console.log(prompt);
      const finalPrompt = `${prompt}\n\n${resumeText}`;
      const response = await this.agent.models.generateContent({
        model: 'gemini-2.0-flash',
        contents: finalPrompt,
        config: {
          responseMimeType: 'text/plain',
        },
      });

      const resultText = response.text ?? '[No response text]';
      await fs.writeFile('output.txt', resultText);
      return resultText;
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  }
}

import { Injectable } from '@nestjs/common';
import * as pdf from 'pdf-parse';
import { GoogleGenAI } from '@google/genai';
import { Express } from 'express';
import sectionedCVPrompt from './quick-test';
import { saveResource } from 'src/common/utlities/utlities';
import { CvScoreDocument, CvScore } from 'src/schemas/cv-score.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { console } from 'inspector';
@Injectable()
export class ScoreCvService {
  private agent: GoogleGenAI;

 constructor(
  @InjectModel(CvScore.name) private cvScoreModel: Model<CvScoreDocument>
) {
  this.agent = new GoogleGenAI({ apiKey: process.env.Google_API_KEY });
}

  async analyzeCV(uploadedFile: Express.Multer.File, jobDescription: string): Promise<any> {
    try {
      const pdfData = await pdf(uploadedFile.buffer);
      const resumeText = pdfData.text;
      const prompt = sectionedCVPrompt(resumeText, jobDescription);
      const response = await this.agent.models.generateContent({
        model: 'gemini-2.0-flash',
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        // generationConfig: {
        //   temperature: 0.3,
        //   responseMimeType: 'text/plain',
        // },
      });

      const text = response.text || '[No response text]';
      const jsonMatch = text.match(/```json([\s\S]*?)```/);
      if (!jsonMatch) throw new Error('No JSON block found in response');
      const jsonStr = jsonMatch[1].trim();
      // await saveResource(
      //       uploadedFile.buffer,
      //       username,
      //       'resume',
      //       this.resourceService
      //     );
      //     await saveResource(
      //       resultText,
      //       username,
      //       'result',
      //       this.resourceService
      //     );
      return JSON.parse(jsonStr);

    } catch (error) {
      return { error: true, message: error.message };
    }
  }
  async saveScore(data: Partial<CvScore>) {
    
  console.log('Saving CV score data:', data);
    return this.cvScoreModel.create(data);
  }
}

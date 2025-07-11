import { Injectable, Post } from '@nestjs/common';
import * as pdf from 'pdf-parse';
import { GoogleGenAI } from '@google/genai';
import { Express } from 'express';
import sectionedCVPrompt from './quick-test';
import { saveResource } from 'src/common/utlities/utlities';
import { CvScoreDocument, CvScore } from 'src/schemas/cv-score.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { console } from 'inspector';
import { summarizeText } from 'src/common/utlities/utlities';
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
  async getCandidate(jobDescription: string) {
    const candidates = await this.prepareCandidates();
  
    const prompt = `
  You are an AI recruiter.
  
  **Job Description:**
  ${jobDescription}
  
  **Candidates:**
  ${candidates.map(c => `
  ID: ${c._id}
  Job Section: ${c.jobSection}
  Score: ${c.score} (out of 100)
  Summary: ${c.summary}
  `).join("\n\n")}
  
  Based on:
  - How relevant the jobSection is to the job description.
  - How well the summary matches the job description.
  - The stored score (but it's based on older job descriptions).
  
  Pick the single best candidate overall.
  
  **Instructions:**
  Return ONLY a JSON object with this format:
  
  {
    "id": "CANDIDATE_ID"
  }
  
  No other text.
  `;
  
  const response = await this.agent.models.generateContent({
    model: 'gemini-2.0-flash',
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
    
  });
  
    const text = response.text || "[No response text]";
  
    const jsonMatch = text.match(/```json([\s\S]*?)```/);
    if (!jsonMatch) throw new Error("No JSON block found in AI response.");
  
    const jsonStr = jsonMatch[1].trim();
    const result = JSON.parse(jsonStr);
  
    console.log(result);
    const cv = await this.cvScoreModel.findOne({ userId: result.id });
    console.log(cv);
    return cv;
  }
  
  async prepareCandidates() {
    console.log("done");
  
    const cvs = await this.cvScoreModel.aggregate([

      {
        $sort: { userId: 1, createdAt: -1 }
      },
      {
        $group: {
          _id: "$userId",
          latestCv: { $first: "$$ROOT" }
        }
      }
    ]);
  
    const summaries: { _id: string, summary: string, score:number, jobSection: string }[] = [];

  
    for (const cv of cvs) {
      const summary = await summarizeText(cv.latestCv.cvText, 10);
      summaries.push({ _id: cv.latestCv.userId, summary, score: cv.latestCv.scoreResult.overall_score, jobSection: cv.latestCv.jobSection });
      console.log(summary);
    }
  
    return summaries;
  }

  async getScoresByUserId(userId: string) {
    return this.cvScoreModel.find({ userId }).sort({ createdAt: -1 });
  }

  async getAllScores() {
    return this.cvScoreModel.find({}).sort({ createdAt: -1 });
  }

  async getScoreById(cvId: string) {
    return this.cvScoreModel.findById(cvId);
  }

  async updateScoreById(cvId: string, updateDto: Partial<CvScore>) {
    return this.cvScoreModel.findByIdAndUpdate(cvId, updateDto, { new: true });
  }

  async deleteScoreById(cvId: string) {
    return this.cvScoreModel.findByIdAndDelete(cvId);
  }
  
}

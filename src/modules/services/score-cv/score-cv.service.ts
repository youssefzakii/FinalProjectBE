import { Injectable, Post } from '@nestjs/common';
import * as pdf from 'pdf-parse';
import { GoogleGenAI } from '@google/genai';
import { Express } from 'express';
import sectionedCVPrompt from './quick-test';
import { saveResource } from 'src/common/utlities/utlities';
import { CvScoreDocument, CvScore } from 'src/schemas/cv-score.schema';
import { User, UserDocument, UserSchema } from 'src/schemas/user.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { console } from 'inspector';
import { summarizeText } from 'src/common/utlities/utlities';
import { CreateJobDto } from 'src/modules/auth/dto/create-job.dto';
import { Types } from 'mongoose';
@Injectable()
export class ScoreCvService {
  private agent: GoogleGenAI;
  constructor(
    @InjectModel(CvScore.name) private cvScoreModel: Model<CvScoreDocument>,
    @InjectModel('User') private userModel: Model<UserDocument>
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
      });

      const text = response.text || '[No response text]';
      const jsonMatch = text.match(/```json([\s\S]*?)```/);
      if (!jsonMatch) throw new Error('No JSON block found in response');
      const jsonStr = jsonMatch[1].trim();

      return JSON.parse(jsonStr);

    } catch (error) {
      return { error: true, message: error.message };
    }
  }

  async saveScore(data: Partial<CvScore>) {
    console.log('Saving CV score data:', data);
    return this.cvScoreModel.create(data);
  }

  async test(jobDescription: CreateJobDto) {
    const candidates = await this.prepareCandidates();
    return candidates;
    console.log('ok');
    return 1;
  }

  async getCan(jobDescription: CreateJobDto) {
    const candidates = await this.prepareCandidates();
  
    const n = 5;
  
    const prompt = `
  You are an AI recruiter.
  
  **Job Description:**
  ${jobDescription.description}
  
  Each candidate includes:
  - A unique CV ID
  - A user ID
  - A summary of their CV
  - A job section (if available)
  - An old score (from a previous job)
  
  ### Step 1: Score all candidates
  Carefully assign a **new score (0–100)** to each candidate.  
  Use the following criteria:
  - **Summary relevance** to the job (most important)
  - **Job Section match** to the job (if provided)
  - **Old score** (can be used as a minor input)
  
  ### Step 2: Select top ${n}
  Choose the candidates with the **highest new scores**.
  Return them sorted by score descending.
  
  ### Output
  Return **only** this JSON format, no extra text:
  
  \`\`\`json
  [
    {
      "cvId": "CV_ID",
      "userId": "USER_ID",
      "geminiScore": 92
    }
  ]
  \`\`\`
  
  Here are the candidates:
  
  ${candidates.map(c => `
  CV ID: ${c.cvId}
  User ID: ${c.userId}
  Job Section: ${Array.isArray(c.jobSection) ? c.jobSection.join(', ') : c.jobSection || "N/A"}
  Old Score: ${c.score}
  Summary: ${c.summary}
  `).join("\n\n")}
  `;
  
    const response = await this.agent.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
    });
  
    const text = response.text || "[No response text]";
  
    const jsonMatch = text.match(/```json([\s\S]*?)```/);
    if (!jsonMatch) throw new Error("No JSON block found in AI response.");
  
    const jsonStr = jsonMatch[1].trim();
    const ranked = JSON.parse(jsonStr); // [{ userId, cvId, geminiScore }]
  
    // Merge additional user data from original candidates array
    const enriched = ranked.map(item => {
      const matched = candidates.find(c => c.cvId === item.cvId && c.userId === item.userId);
      return {
        ...item,
        username: matched?.username || 'N/A',
        email: matched?.email || 'N/A',
        Fields: matched?.Fields || [],
        cvFileUrl: matched?.cvFileUrl || null
      };
    });
  
    return enriched;
  }
  

  async prepareCandidates() {
  console.log("done");

  const aggregated = await this.cvScoreModel.aggregate([
    { $sort: { userId: 1, createdAt: -1 } },
    {
      $group: {
        _id: "$userId",
        latestCv: { $first: "$$ROOT" }
      }
    }
  ]);

  const latestCvIds = aggregated.map(entry => entry.latestCv._id);

  const cvs = await this.cvScoreModel.find({ _id: { $in: latestCvIds } }).lean();
  const summaries : any = [];

  for (const cv of cvs) {
    const summary = await summarizeText(cv.cvText, 10);
    const user = await this.userModel.findOne({ _id: new Types.ObjectId(cv.userId) });
    if (!user) {
      console.warn(`User not found for CV ID: ${cv._id}`);
      continue;
    }
    summaries.push({
      userId: user?._id.toString(),
      cvId: cv._id.toString(),
      summary,
      score: cv.scoreResult?.overall_score || 0,
      jobSection: cv.jobSection || [],
      username: user?.username || 'N/A',
      email: user?.email || 'N/A',
      Fields: user?.Fields || [],
      cvFileUrl: cv.cvFileUrl
    });

    console.log("summary:", summary);
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

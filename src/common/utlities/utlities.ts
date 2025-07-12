import { promises as fs } from 'fs';
import * as path from 'path';
import * as fsSync from 'fs';
import { v4 as uuidv4 } from 'uuid';
import { SummarizerManager } from 'node-summarizer';
import { uploadBufferToCloudinary } from 'src/middlewares/cloudnaryCv.provider';
export async function summarizeText(text: string, n: number): Promise<string> {
  if (!text || text.trim().split(/\s+/).length < 30) {
    return text.trim();
  }

  const summarizer = new SummarizerManager(text, 30);
  const result = await summarizer.getSummaryByRank();
  const sentences = result.sentence_list;

  if (!sentences || sentences.length === 0) {
    return text.trim();
  }

  const ans =  sentences.slice(0, n).join(' ').trim();
  console.log(ans);
  return ans;
}

export async function saveResource(
  buffer: Buffer | string,
  username: string,
  type: string,
  resourceService: any
) {
  const ext = type === 'resume' ? 'pdf' : 'txt';
  const fname = `${uuidv4()}.${ext}`;

  const cloudUrl = await uploadBufferToCloudinary(buffer, 'resources', fname);

  await resourceService.create({
    username,
    title: fname,
    url: cloudUrl,
    type,
  });

  return cloudUrl;
}

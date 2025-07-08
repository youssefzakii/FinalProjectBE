import { promises as fs } from 'fs';
import * as path from 'path';
import * as fsSync from 'fs';
import { v4 as uuidv4 } from 'uuid';

export async function saveResource(
  buffer: Buffer | string,
  username: string,
  type: string,
  resourceService: any
) {
  const outputDir = 'output';
  const ext = type === 'resume' ? 'pdf' : 'txt';
  const fname = `${uuidv4()}.${ext}`;
  const filePath = path.join(outputDir, fname);

  if (!fsSync.existsSync(outputDir)) {
    await fs.mkdir(outputDir, { recursive: true });
  }

  await fs.writeFile(filePath, buffer);

  await resourceService.create({
    username,
    title: fname,
    url: filePath,
    type,
  });

  return filePath;
}

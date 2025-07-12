import { ConfigService } from "@nestjs/config";
import { v2 as cloudinary } from "cloudinary";
import * as streamifier from "streamifier";
export const uploadBufferToCloudinary = async (
  buffer: Buffer | string,
  folder = "resources",
  filename?: string
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const upload = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: "auto",
        public_id: filename ? filename.replace(/\.[^/.]+$/, "") : undefined // remove extension if provided
      },
      (error, result) => {
        if (error) return reject(error);
        if (!result?.secure_url)
          return reject("Upload failed: No URL returned");
        resolve(result.secure_url);
      }
    );

    const finalBuffer = typeof buffer === "string" ? Buffer.from(buffer) : buffer;
    streamifier.createReadStream(finalBuffer).pipe(upload);
  });
};

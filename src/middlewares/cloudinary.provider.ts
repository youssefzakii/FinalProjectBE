import { ConfigService } from "@nestjs/config";
import { v2 as cloudinary } from "cloudinary";
import * as streamifier from "streamifier";

export const CloudinaryProvider = {
  provide: "CLOUDINARY",
  inject: [ConfigService],
  useFactory: (configService: ConfigService) => {
    cloudinary.config({
      cloud_name: configService.get<string>("CLOUDINARY_CLOUD_NAME"),
      api_key: configService.get<string>("CLOUDINARY_API_KEY"),
      api_secret: configService.get<string>("CLOUDINARY_API_SECRET"),
    });
    return cloudinary;
  },
};

export const uploadToCloudinary = async (
  file: Express.Multer.File
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const upload = cloudinary.uploader.upload_stream(
      {
        folder: "company_logos", // optional folder name
      },
      (error, result) => {
        if (error) return reject(error);
        if (!result?.secure_url)
          return reject("Upload failed: No URL returned");
        resolve(result.secure_url);
      }
    );

    streamifier.createReadStream(file.buffer).pipe(upload);
  });
};

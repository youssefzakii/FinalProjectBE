import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { MongooseModule } from "@nestjs/mongoose";
import { User, UserSchema } from "src/schemas/user.schema";
import { ConfigModule } from "@nestjs/config";
import { CloudinaryProvider } from "src/middlewares/cloudinary.provider";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [AuthController],
  providers: [AuthService, CloudinaryProvider],
  exports: ["CLOUDINARY"],
})
export class AuthModule {}

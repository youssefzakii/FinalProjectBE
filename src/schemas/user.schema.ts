import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  /*
  @Prop({ required: true })
  fullname: string;
*/
  @Prop({ required: true, unique: true })
  username: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;
  /*
  @Prop({ required: true })
  age: number;

  @Prop()
  phone: string;
*/
  @Prop({ default: "user", enum: ["user", "admin"] })
  role: string;

  @Prop({ required: true })
  Fields: string[];

  @Prop({ type: String, default: null })
  avatar: string;
}

export const UserSchema = SchemaFactory.createForClass(User);

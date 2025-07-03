import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export type CompanyDocument = HydratedDocument<Company>;

@Schema()
export class Company {
  @Prop({ required: true, unique: true })
  companyName: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ type: [String], default: [] })
  Fields: string[];

  @Prop()
  description: string;

  @Prop()
  logo: string;
}

export const CompanySchema = SchemaFactory.createForClass(Company);

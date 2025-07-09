import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";

export type CvScoreDocument = HydratedDocument<CvScore>;

@Schema({ timestamps: true })
export class CvScore {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ required: true })
  username: string;

  @Prop({ required: true })
  cvText: string;

  @Prop({ required: true })
  jobDescription: string;

  @Prop({ required: true, type: Array })
  jobSection:any[];

  @Prop({ required: true, type: Object })
  scoreResult: any;

  @Prop({ required: true })
  cvFileUrl: string; 
}

export const CvScoreSchema = SchemaFactory.createForClass(CvScore);
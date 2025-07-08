import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";
import { Company } from "./compnay.schema";
import { Types } from "mongoose";
import mongoose from 'mongoose';
export type JobDescriptionDocument = HydratedDocument<JobDescription>;
@Schema()
export class JobDescription {
    @Prop({ required: true })
    description: string;
    @Prop({ required: true })
    title: string;
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true })
    company: Company;
    @Prop({default:true})
    approved: boolean
}

export const JobDescriptionSchema = SchemaFactory.createForClass(JobDescription);

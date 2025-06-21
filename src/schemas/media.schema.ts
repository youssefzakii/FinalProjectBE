import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";
export type ResourceDocument = HydratedDocument<Resource>;
@Schema()
export class Resource{
    @Prop({ required: false })
    title: string;
    @Prop({ required: true })
    url: string;
    
    @Prop({ required: true })
    type: string;
    
    @Prop({ default: Date.now })
    createdAt: Date;
    @Prop({required: true })
    username: string;
}
export const ResourceSchema = SchemaFactory.createForClass(Resource);
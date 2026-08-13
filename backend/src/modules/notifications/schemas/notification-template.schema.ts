import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type NotificationTemplateDocument = NotificationTemplate & Document;

@Schema({ timestamps: true })
export class NotificationTemplate {
  @Prop({ required: true, unique: true })
  type: string;

  @Prop({ required: true })
  label: string;

  @Prop({ required: true })
  icon: string;

  @Prop({ required: true })
  description: string;

  @Prop({ default: true })
  enabled: boolean;
}

export const NotificationTemplateSchema =
  SchemaFactory.createForClass(NotificationTemplate);

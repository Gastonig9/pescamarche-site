import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type NotificationDocument = Notification & Document;

@Schema({ timestamps: true })
export class Notification {
  @Prop({ required: true })
  type: string;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  body: string;

  @Prop({ type: [String], default: [] })
  readBy: string[];

  // User who triggered this — they will not see it
  @Prop()
  actorId?: string;

  @Prop()
  link?: string;

  @Prop({ type: Object })
  data?: Record<string, unknown>;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);
NotificationSchema.index({ createdAt: -1 });
NotificationSchema.index({ readBy: 1 });

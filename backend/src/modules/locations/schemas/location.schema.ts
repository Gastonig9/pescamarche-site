import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type LocationDocument = Location & Document;

@Schema({ timestamps: true })
export class Location {
  @Prop({ trim: true })
  jurisdiccionProvincia: string;

  @Prop({ trim: true })
  zona: string;

  @Prop({ trim: true })
  partidoComuna: string;

  @Prop({ trim: true })
  barrioLocalidad: string;

  @Prop({ trim: true })
  codigoPostal: string;
}

export const LocationSchema = SchemaFactory.createForClass(Location);

// Compound index for fast lookups by postal code and locality
LocationSchema.index({ codigoPostal: 1 });
LocationSchema.index({ barrioLocalidad: 1 });

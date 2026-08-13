import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ProductDocument = Product & Document;

@Schema({
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: (_doc, ret: Record<string, unknown>) => {
      // Ensure id is always a plain string
      ret.id = (ret._id as object)?.toString();
      return ret;
    },
  },
})
export class Product {
  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true, min: 0 })
  price: number;

  @Prop({ type: [String], default: [] })
  images: string[];

  @Prop()
  brand?: string;

  @Prop()
  category?: string;

  @Prop()
  subcategory?: string;

  @Prop({ unique: true, sparse: true, trim: true })
  sku?: string;

  @Prop({ required: true, min: 0, default: 0 })
  stock: number;

  @Prop({ default: false })
  featured: boolean;
}

export const ProductSchema = SchemaFactory.createForClass(Product);

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type OrderStatus =
  'pending' | 'paid' | 'processing' | 'completed' | 'cancelled';

export type ShippingStatus = 'pending' | 'preparing' | 'shipped' | 'delivered';

export type OrderDocument = Order & Document;

@Schema({ _id: false })
export class OrderItem {
  @Prop({ type: Types.ObjectId, ref: 'Product', required: true })
  product: Types.ObjectId;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true, min: 0 })
  price: number;

  @Prop({ required: true, min: 1 })
  quantity: number;

  @Prop({ required: true, min: 0 })
  subtotal: number;
}

export const OrderItemSchema = SchemaFactory.createForClass(OrderItem);

@Schema({ _id: false })
export class ShippingAddress {
  @Prop({ required: true })
  street: string;

  @Prop({ required: true })
  city: string;

  @Prop({ required: true })
  province: string;

  @Prop({ required: true })
  postalCode: string;

  @Prop({ default: 'Argentina' })
  country: string;
}

export const ShippingAddressSchema =
  SchemaFactory.createForClass(ShippingAddress);

@Schema({ timestamps: true })
export class Order {
  @Prop({
    type: {
      name: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String },
      userId: { type: Types.ObjectId, ref: 'User' },
    },
    required: true,
  })
  customer: {
    name: string;
    email: string;
    phone?: string;
    userId?: Types.ObjectId;
  };

  @Prop({ type: [OrderItemSchema], required: true })
  items: OrderItem[];

  @Prop({ type: ShippingAddressSchema, required: true })
  shippingAddress: ShippingAddress;

  @Prop({ required: true })
  shippingMethod: string;

  @Prop({ required: true, min: 0, default: 0 })
  shippingCost: number;

  @Prop({
    required: true,
    enum: ['pending', 'preparing', 'shipped', 'delivered'],
    default: 'pending',
  })
  shippingStatus: ShippingStatus;

  @Prop({
    required: true,
    enum: ['pending', 'paid', 'processing', 'completed', 'cancelled'],
    default: 'pending',
  })
  status: OrderStatus;

  @Prop({ required: true, min: 0 })
  total: number;

  @Prop()
  notes?: string;

  @Prop()
  mpPreferenceId?: string;
}

export const OrderSchema = SchemaFactory.createForClass(Order);

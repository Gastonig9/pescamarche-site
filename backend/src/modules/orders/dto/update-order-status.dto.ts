import { IsEnum, IsOptional } from 'class-validator';
import type { OrderStatus, ShippingStatus } from '../schemas/order.schema';

export class UpdateOrderStatusDto {
  @IsEnum(['pending', 'paid', 'processing', 'completed', 'cancelled'])
  @IsOptional()
  status?: OrderStatus;

  @IsEnum(['pending', 'preparing', 'shipped', 'delivered'])
  @IsOptional()
  shippingStatus?: ShippingStatus;
}

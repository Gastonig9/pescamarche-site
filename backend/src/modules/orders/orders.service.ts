import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order, OrderDocument } from './schemas/order.schema';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { EmailService } from '../email/email.service';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
    private readonly emailService: EmailService,
  ) {}

  create(createOrderDto: CreateOrderDto): Promise<Order> {
    return this.orderModel.create(createOrderDto);
  }

  findAll(): Promise<Order[]> {
    return this.orderModel.find().sort({ createdAt: -1 }).exec();
  }

  async findOne(id: string): Promise<Order> {
    const order = await this.orderModel.findById(id).exec();
    if (!order) {
      throw new NotFoundException(`Order with id ${id} not found`);
    }
    return order;
  }

  async updateStatus(
    id: string,
    updateOrderStatusDto: UpdateOrderStatusDto,
  ): Promise<Order> {
    const update: Record<string, unknown> = { ...updateOrderStatusDto };

    // Auto-set paymentDate and send email on first transition to 'paid'
    if (updateOrderStatusDto.status === 'paid') {
      const existing = await this.orderModel.findById(id).exec();
      if (existing && existing.status !== 'paid') {
        update.paymentDate = new Date();
        const o = existing as unknown as {
          customer: { name: string; email: string };
          items: {
            name: string;
            quantity: number;
            price: number;
            subtotal: number;
          }[];
          shippingMethod: string;
          shippingCost: number;
          total: number;
          paymentMethod: string;
          shippingAddress: {
            street: string;
            city: string;
            province: string;
            postalCode: string;
          };
        };
        this.emailService
          .sendOrderConfirmation({
            customerName: o.customer.name,
            customerEmail: o.customer.email,
            orderId: id,
            items: o.items,
            shippingMethod: o.shippingMethod,
            shippingCost: o.shippingCost,
            total: o.total,
            paymentMethod: o.paymentMethod ?? 'mercadopago',
            paymentDate: update.paymentDate as Date,
            shippingAddress: o.shippingAddress,
          })
          .catch(() => void 0); // fire-and-forget, never block the status update
      }
    }

    const order = await this.orderModel
      .findByIdAndUpdate(id, update, { new: true })
      .exec();
    if (!order) {
      throw new NotFoundException(`Order with id ${id} not found`);
    }
    return order;
  }

  async remove(id: string): Promise<void> {
    const result = await this.orderModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Order with id ${id} not found`);
    }
  }

  async updateMpPreferenceId(
    id: string,
    mpPreferenceId: string,
  ): Promise<void> {
    await this.orderModel.findByIdAndUpdate(id, { mpPreferenceId }).exec();
  }
}

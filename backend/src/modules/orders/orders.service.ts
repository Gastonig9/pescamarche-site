import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order, OrderDocument } from './schemas/order.schema';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { EmailService } from '../email/email.service';
import { NotificationsService } from '../notifications/notifications.service';
import { Product, ProductDocument } from '../products/schemas/product.schema';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
    private readonly emailService: EmailService,
    private readonly notificationsService: NotificationsService,
  ) {}

  create(createOrderDto: CreateOrderDto): Promise<Order> {
    const promise = this.orderModel.create(createOrderDto);
    // fire-and-forget side effects
    promise.then(async (order) => {
      const doc = order as unknown as {
        _id: { toString(): string };
        customer: { name: string };
        total: number;
        items: { product: string; quantity: number }[];
      };

      // Decrement stock for each ordered product
      for (const item of doc.items ?? []) {
        await this.productModel
          .findByIdAndUpdate(item.product, { $inc: { stock: -item.quantity } })
          .exec();
      }

      this.notificationsService
        .create({
          type: 'nueva_orden',
          title: 'Nueva orden recibida',
          body: `${doc.customer.name} realizó un pedido por $${doc.total.toFixed(2)}`,
          link: '/pedidos',
          data: { orderId: doc._id.toString() },
        })
        .catch(() => void 0);
    });
    return promise;
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
          .catch(() => void 0);

        this.notificationsService
          .create({
            type: 'pago_acreditado',
            title: 'Pago acreditado',
            body: `El pedido de ${o.customer.name} por $${o.total.toFixed(2)} fue confirmado.`,
            link: '/pedidos',
            data: { orderId: id },
          })
          .catch(() => void 0);
      }
    }

    // Notify on payment rejection
    if (updateOrderStatusDto.status === 'cancelled') {
      const prev = await this.orderModel.findById(id).exec();
      if (prev && prev.status !== 'cancelled') {
        const name =
          (prev as unknown as { customer: { name: string } }).customer?.name ??
          '';
        this.notificationsService
          .create({
            type: 'pago_rechazado',
            title: 'Pago rechazado',
            body: `El pago del pedido de ${name} fue rechazado.`,
            link: '/pedidos',
            data: { orderId: id },
          })
          .catch(() => void 0);
      }
    }

    // Notify on shipment
    if (updateOrderStatusDto.shippingStatus === 'shipped') {
      const prev = await this.orderModel.findById(id).exec();
      if (prev && prev.shippingStatus !== 'shipped') {
        const name =
          (prev as unknown as { customer: { name: string } }).customer?.name ??
          '';
        this.notificationsService
          .create({
            type: 'pedido_enviado',
            title: 'Pedido enviado',
            body: `El pedido de ${name} fue marcado como enviado.`,
            link: '/pedidos',
            data: { orderId: id },
          })
          .catch(() => void 0);
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

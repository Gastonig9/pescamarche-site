import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MercadoPagoConfig, Preference, Payment } from 'mercadopago';
import { OrdersService } from '../orders/orders.service';
import type { OrderStatus } from '../orders/schemas/order.schema';

@Injectable()
export class PaymentsService {
  private readonly client: MercadoPagoConfig;

  constructor(
    private readonly configService: ConfigService,
    private readonly ordersService: OrdersService,
  ) {
    this.client = new MercadoPagoConfig({
      accessToken: this.configService.get<string>('mpAccessToken') ?? '',
    });
  }

  async createPreference(orderId: string) {
    const order = await this.ordersService.findOne(orderId);
    if (!order) throw new NotFoundException('Pedido no encontrado');

    const frontendUrl = this.configService.get<string>('frontendUrl');
    const backendUrl = this.configService.get<string>('backendUrl');
    const orderDoc = order as unknown as { total: number };
    // auto_return only works with HTTPS public URLs (not localhost)
    const isPublicUrl = frontendUrl?.startsWith('https://');

    const preference = new Preference(this.client);
    const result = await preference.create({
      body: {
        external_reference: orderId,
        items: [
          {
            id: orderId,
            title: `Compra Pescamarche #${orderId.slice(-6).toUpperCase()}`,
            quantity: 1,
            unit_price: orderDoc.total,
            currency_id: 'ARS',
          },
        ],
        back_urls: {
          success: `${frontendUrl}/pedido-confirmado`,
          failure: `${frontendUrl}/pago-fallido`,
          pending: `${frontendUrl}/pedido-confirmado`,
        },
        ...(isPublicUrl ? { auto_return: 'approved' } : {}),
        notification_url: `${backendUrl}/api/payments/webhook`,
      },
    });

    // Store preference ID on the order for traceability
    await this.ordersService.updateMpPreferenceId(orderId, result.id ?? '');

    return {
      preferenceId: result.id,
      // init_point = production; sandbox_init_point = test fallback
      initPoint: result.init_point ?? result.sandbox_init_point,
    };
  }

  async handleWebhook(body: Record<string, unknown>): Promise<void> {
    // MP sends type="payment" for payment notifications
    if (body.type !== 'payment' && body.topic !== 'payment') return;

    const paymentId =
      ((body.data as Record<string, unknown>)?.id as string) ??
      (body.id as string);
    if (!paymentId) return;

    try {
      const paymentClient = new Payment(this.client);
      const payment = await paymentClient.get({ id: paymentId });

      const orderId = payment.external_reference as string;
      const mpStatus = payment.status as string;

      if (!orderId || !mpStatus) return;

      const statusMap: Record<string, OrderStatus> = {
        approved: 'paid',
        pending: 'pending',
        in_process: 'pending',
        rejected: 'cancelled',
        cancelled: 'cancelled',
        refunded: 'cancelled',
      };

      const newStatus = statusMap[mpStatus] ?? 'pending';
      // updateStatus handles email + paymentDate automatically on transition to 'paid'
      await this.ordersService.updateStatus(orderId, { status: newStatus });
    } catch {
      // Log silently — webhook must always return 200 to MP
    }
  }
}

import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

export interface OrderEmailData {
  customerName: string;
  customerEmail: string;
  orderId: string;
  items: { name: string; quantity: number; price: number; subtotal: number }[];
  shippingMethod: string;
  shippingCost: number;
  total: number;
  paymentMethod: string;
  paymentDate: Date;
  shippingAddress?: {
    street: string;
    city: string;
    province: string;
    postalCode: string;
  };
}

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private transporter: nodemailer.Transporter;

  constructor(private readonly configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: this.configService.get<string>('gmailUser'),
        pass: this.configService.get<string>('gmailAppPassword'),
      },
    });
  }

  async sendOrderConfirmation(data: OrderEmailData): Promise<void> {
    const subject = `✅ Pago confirmado - Pedido #${data.orderId.slice(-6).toUpperCase()} | Pescamarche`;

    const paymentMethodLabel =
      data.paymentMethod === 'alias'
        ? 'Transferencia bancaria (alias)'
        : 'MercadoPago';

    const paymentDateStr = data.paymentDate
      ? new Intl.DateTimeFormat('es-AR', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          timeZone: 'America/Argentina/Buenos_Aires',
        }).format(new Date(data.paymentDate))
      : '-';

    const itemsRows = data.items
      .map(
        (item) => `
        <tr>
          <td style="padding:10px 12px;border-bottom:1px solid #eee;">${item.name}</td>
          <td style="padding:10px 12px;border-bottom:1px solid #eee;text-align:center;">${item.quantity}</td>
          <td style="padding:10px 12px;border-bottom:1px solid #eee;text-align:right;">$${item.price.toFixed(2)}</td>
          <td style="padding:10px 12px;border-bottom:1px solid #eee;text-align:right;font-weight:600;">$${item.subtotal.toFixed(2)}</td>
        </tr>`,
      )
      .join('');

    const addressSection = data.shippingMethod.toLowerCase().includes('retiro')
      ? `<p style="margin:4px 0;color:#555;">📍 Retiro en tienda — Villa Lugano, Buenos Aires</p>`
      : `<p style="margin:4px 0;color:#555;">📦 ${data.shippingAddress?.street}, ${data.shippingAddress?.city}, ${data.shippingAddress?.province} (${data.shippingAddress?.postalCode})</p>`;

    const html = `
<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f5f7fa;font-family:'Segoe UI',Roboto,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f7fa;padding:40px 20px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#fff;border-radius:10px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,.08);">

        <!-- Header -->
        <tr>
          <td style="background:#1b2559;padding:32px 40px;text-align:center;">
            <h1 style="margin:0;color:#fff;font-size:24px;letter-spacing:1px;">PESCAMARCHE</h1>
            <p style="margin:6px 0 0;color:#a0b0d0;font-size:13px;">Pesca & Camping · Villa Lugano</p>
          </td>
        </tr>

        <!-- Confirmation banner -->
        <tr>
          <td style="background:#e8f5e9;padding:20px 40px;text-align:center;border-bottom:3px solid #4caf50;">
            <p style="margin:0;font-size:18px;color:#2e7d32;font-weight:700;">✅ ¡Pago acreditado exitosamente!</p>
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="padding:32px 40px;">
            <p style="margin:0 0 8px;font-size:15px;color:#333;">Hola <strong>${data.customerName}</strong>,</p>
            <p style="margin:0 0 24px;font-size:15px;color:#555;">
              Tu pago fue procesado y acreditado. A continuación encontrás el detalle de tu compra.
            </p>

            <!-- Order number -->
            <div style="background:#f0f4ff;border-radius:6px;padding:14px 20px;margin-bottom:24px;">
              <p style="margin:0;font-size:13px;color:#666;">Número de pedido</p>
              <p style="margin:4px 0 0;font-size:18px;font-weight:700;color:#1b2559;letter-spacing:2px;">
                #${data.orderId.slice(-6).toUpperCase()}
              </p>
            </div>

            <!-- Items table -->
            <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;margin-bottom:20px;">
              <thead>
                <tr style="background:#f5f7fa;">
                  <th style="padding:10px 12px;text-align:left;font-size:12px;color:#888;text-transform:uppercase;">Producto</th>
                  <th style="padding:10px 12px;text-align:center;font-size:12px;color:#888;text-transform:uppercase;">Cant.</th>
                  <th style="padding:10px 12px;text-align:right;font-size:12px;color:#888;text-transform:uppercase;">Precio</th>
                  <th style="padding:10px 12px;text-align:right;font-size:12px;color:#888;text-transform:uppercase;">Subtotal</th>
                </tr>
              </thead>
              <tbody>${itemsRows}</tbody>
            </table>

            <!-- Totals -->
            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
              <tr>
                <td style="padding:6px 0;color:#555;font-size:14px;">Envío — ${data.shippingMethod}</td>
                <td style="padding:6px 0;text-align:right;color:#555;font-size:14px;">
                  ${data.shippingCost === 0 ? 'Gratis' : `$${data.shippingCost.toFixed(2)}`}
                </td>
              </tr>
              <tr style="border-top:2px solid #1b2559;">
                <td style="padding:12px 0 0;font-size:17px;font-weight:700;color:#1b2559;">Total pagado</td>
                <td style="padding:12px 0 0;text-align:right;font-size:17px;font-weight:700;color:#1b2559;">$${data.total.toFixed(2)}</td>
              </tr>
            </table>

            <!-- Payment info -->
            <div style="background:#f0f4ff;border-radius:6px;padding:14px 20px;margin-bottom:24px;display:flex;gap:32px;flex-wrap:wrap;">
              <div>
                <p style="margin:0;font-size:12px;color:#888;text-transform:uppercase;letter-spacing:.5px;">Medio de pago</p>
                <p style="margin:4px 0 0;font-size:14px;font-weight:600;color:#1b2559;">${paymentMethodLabel}</p>
              </div>
              <div>
                <p style="margin:0;font-size:12px;color:#888;text-transform:uppercase;letter-spacing:.5px;">Fecha de pago</p>
                <p style="margin:4px 0 0;font-size:14px;font-weight:600;color:#1b2559;">${paymentDateStr}</p>
              </div>
            </div>

            <!-- Shipping info -->
            <div style="background:#f9f9f9;border-radius:6px;padding:16px 20px;margin-bottom:24px;">
              <p style="margin:0 0 8px;font-size:13px;font-weight:600;color:#333;text-transform:uppercase;letter-spacing:.5px;">Información de entrega</p>
              ${addressSection}
              <p style="margin:8px 0 0;color:#555;font-size:13px;">
                Te contactaremos para coordinar los detalles de entrega.
              </p>
            </div>

            <p style="margin:0;font-size:14px;color:#555;">
              Ante cualquier consulta podés escribirnos o llamarnos.<br>
              ¡Gracias por elegirnos! 🎣
            </p>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="background:#f5f7fa;padding:20px 40px;text-align:center;border-top:1px solid #eee;">
            <p style="margin:0;font-size:12px;color:#999;">Pescamarche · Pesca & Camping · Villa Lugano, CABA</p>
            <p style="margin:4px 0 0;font-size:12px;color:#999;">Tel: 4601-9578 / 11-28344179</p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;

    try {
      await this.transporter.sendMail({
        from: `"Pescamarche" <${this.configService.get<string>('gmailUser')}>`,
        to: data.customerEmail,
        subject,
        html,
      });
      this.logger.log(`Order confirmation email sent to ${data.customerEmail}`);
    } catch (err) {
      this.logger.error(`Failed to send email to ${data.customerEmail}`, err);
    }
  }
}

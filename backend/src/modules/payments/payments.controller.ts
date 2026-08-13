import { Body, Controller, HttpCode, Param, Post } from '@nestjs/common';
import { PaymentsService } from './payments.service';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('preference/:orderId')
  createPreference(@Param('orderId') orderId: string) {
    return this.paymentsService.createPreference(orderId);
  }

  // MP sends POST with 200 expected; no auth since it's an external callback
  @Post('webhook')
  @HttpCode(200)
  handleWebhook(@Body() body: Record<string, unknown>) {
    return this.paymentsService.handleWebhook(body);
  }
}

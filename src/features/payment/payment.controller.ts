import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { WebhookDto } from './dto/webhook.dto';
import { PaymentWebhookGuard } from './guards';
import { PaymentService } from './payment.service';

@ApiTags('Payment')
@Controller('payment')
export class PaymentController {
  // Controller logic goes here
  constructor(private readonly paymentService: PaymentService) {}
  @Post('webhook')
  @ApiOperation({ summary: 'Handle payment webhook' })
  @UseGuards(PaymentWebhookGuard)
  async handleWebhook(@Body() body: WebhookDto) {
    console.log('Webhook data:', body);
    return this.paymentService.create(body);
    // Handle webhook logic
  }
}

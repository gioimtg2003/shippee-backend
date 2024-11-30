import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { PaymentWebhookGuard } from './guards';

@ApiTags('Payment')
@Controller('payment')
export class PaymentController {
  // Controller logic goes here

  @Post('webhook')
  @ApiOperation({ summary: 'Handle payment webhook' })
  @UseGuards(PaymentWebhookGuard)
  async handleWebhook(@Body() body: any) {
    console.log(body);
    return { received: true };
    // Handle webhook logic
  }
}

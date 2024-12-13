import { Controller, Post } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { OrderService } from './order.service';

@ApiTags('Order')
@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post('sample')
  @ApiOperation({ summary: 'Create bulk order' })
  @ApiOkResponse({ description: 'Bulk order created' })
  async sample() {
    return this.orderService.createBulk();
  }
}

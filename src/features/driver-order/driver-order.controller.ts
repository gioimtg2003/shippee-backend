import { DriverSession } from '@common/dto';
import { ApiArrayResponse, CurrentUser } from '@decorators';
import { DriverAuthGuard } from '@features/driver-auth/guards';
import { OrderEntity } from '@features/order/entities/order.entity';
import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { DriverOrderService } from './driver-order.service';

@ApiTags('Driver Order')
@Controller('driver-order')
export class DriverOrderController {
  constructor(private readonly driverOrderService: DriverOrderService) {}

  @Get('pending')
  @UseGuards(DriverAuthGuard)
  @ApiOperation({ summary: 'Get order pending for driver' })
  @ApiArrayResponse(OrderEntity)
  @HttpCode(HttpStatus.OK)
  async getOrderPending(@CurrentUser() driver: DriverSession) {
    return this.driverOrderService.getOrderPending(driver);
  }
}

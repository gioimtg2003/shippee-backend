import { DriverSession } from '@common/dto';
import { ApiArrayResponse, ApiObjectResponse, CurrentUser } from '@decorators';
import { DriverAuthGuard } from '@features/driver-auth/guards';
import { OrderEntity } from '@features/order/entities/order.entity';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { DriverOrderService } from './driver-order.service';
import { OrderCompletedInput } from './dto/order-completed.input';
import { DriverOrderGuard } from './guards';

@ApiTags('Driver Order')
@Controller('driver-order')
export class DriverOrderController {
  constructor(private readonly driverOrderService: DriverOrderService) {}

  @Get('pending')
  @UseGuards(DriverAuthGuard, DriverOrderGuard)
  @ApiOperation({ summary: 'Get order pending for driver' })
  @ApiArrayResponse(OrderEntity)
  @HttpCode(HttpStatus.OK)
  async getOrderPending(@CurrentUser() driver: DriverSession) {
    return this.driverOrderService.getOrderPending(driver);
  }

  @Get('pending/:id')
  @UseGuards(DriverAuthGuard, DriverOrderGuard)
  @ApiOperation({ summary: 'Get order pending for driver' })
  @ApiObjectResponse(OrderEntity)
  @HttpCode(HttpStatus.OK)
  async getOrderPendingDetail(@Param('id') orderId: number) {
    return this.driverOrderService.getOrderPendingDetail(orderId);
  }

  @Post('pickup/:id')
  @UseGuards(DriverAuthGuard, DriverOrderGuard)
  @ApiOperation({ summary: 'Pick up order' })
  @HttpCode(HttpStatus.OK)
  async pickupOrder(
    @CurrentUser() driver: DriverSession,
    @Param('id') orderId: number,
  ) {
    return this.driverOrderService.pickupOrder(driver, orderId);
  }

  @Get('/delivery')
  @UseGuards(DriverAuthGuard)
  @ApiOperation({ summary: 'Get order pending for driver' })
  @ApiArrayResponse(OrderEntity)
  @HttpCode(HttpStatus.OK)
  async getDetailDelivery(@CurrentUser() driver: DriverSession) {
    return this.driverOrderService.getOrderDetailDelivery(
      driver.idOrder,
      driver.id,
    );
  }

  @Put('arrived')
  @UseGuards(DriverAuthGuard)
  @ApiOperation({ summary: 'Arrived at destination' })
  @HttpCode(HttpStatus.OK)
  async arrivedDestination(@CurrentUser() driver: DriverSession) {
    return this.driverOrderService.arrivedPickup(driver);
  }

  @Put('picked')
  @UseGuards(DriverAuthGuard)
  @ApiOperation({ summary: 'Picked Order' })
  @HttpCode(HttpStatus.OK)
  async pickedOrder(@CurrentUser() driver: DriverSession) {
    return this.driverOrderService.pickedOrder(driver);
  }

  @Put('arrived-recipient')
  @UseGuards(DriverAuthGuard)
  @ApiOperation({ summary: 'Arrived at destination' })
  @HttpCode(HttpStatus.OK)
  async arrivedRecipient(@CurrentUser() driver: DriverSession) {
    return this.driverOrderService.arrivedRecipient(driver);
  }

  @Post('completed')
  @UseGuards(DriverAuthGuard)
  @ApiOperation({ summary: 'Delivery Order' })
  @HttpCode(HttpStatus.OK)
  async deliveryCompleted(
    @Body() data: OrderCompletedInput,
    @CurrentUser() driver: DriverSession,
  ) {
    console.log('data', data);
    return this.driverOrderService.deliveryCompleted(driver, data);
  }
}

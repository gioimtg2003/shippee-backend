import { CustomerSession } from '@common/dto';
import { ApiObjectResponse, CurrentUser } from '@decorators';
import { CustomerGuard } from '@features/customer-auth/guards';
import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CustomerService } from './customer.service';
@ApiTags('Customer')
@Controller('user')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @ApiOperation({ summary: 'Get current user' })
  @ApiObjectResponse(CustomerSession)
  @Get('me')
  @UseGuards(CustomerGuard)
  @HttpCode(HttpStatus.OK)
  async getMe(@CurrentUser() user: CustomerSession) {
    return user;
  }
}

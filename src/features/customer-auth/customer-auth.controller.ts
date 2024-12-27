import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { UserSession } from '@common/dto';
import { DecryptFields } from '@decorators';
import { CustomerAuthService } from './customer-auth.service';
import { CustomerLoginInput } from './dto/customer-login.input';
import { CustomerRegisterInput } from './dto/customer-register.input';
import { CustomerDecryptGuard } from './guards';

@ApiTags('Customer Authenticate')
@Controller('customer-auth')
export class UserAuthController {
  constructor(private readonly cusAuthService: CustomerAuthService) {}

  @Post('/login')
  @ApiOperation({ summary: 'Customer login' })
  @ApiResponse({
    status: 200,
    type: UserSession,
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: CustomerLoginInput) {
    return this.cusAuthService.login(loginDto);
  }

  @Post('/refresh-token')
  @ApiOperation({ summary: 'Refresh token' })
  @ApiResponse({
    status: 200,
    description: 'Successful refresh token',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @HttpCode(HttpStatus.OK)
  async refreshToken() {
    return { message: 'Refresh token' };
  }

  @Post('/register')
  @ApiOperation({ summary: 'Refresh token' })
  @ApiResponse({
    status: 200,
    description: 'Successful refresh token',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @UseGuards(CustomerDecryptGuard)
  @DecryptFields<CustomerRegisterInput>('email', 'password')
  @HttpCode(HttpStatus.OK)
  async register(@Body() registerDto: CustomerRegisterInput) {
    return registerDto;
  }
}

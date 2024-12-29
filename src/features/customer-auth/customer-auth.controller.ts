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

import { CustomerSession } from '@common/dto';
import { REQUEST_LIMIT_RATE } from '@constants';
import { DecryptFields } from '@decorators';
import { Throttle } from '@nestjs/throttler';
import { CustomerAuthService } from './customer-auth.service';
import { CustomerLoginInput } from './dto/customer-login.input';
import {
  CustomerRegisterInput,
  CustomerVerifyEmailInput,
  RefreshOtpInput,
} from './dto/customer-register.input';
import { CustomerDecryptGuard } from './guards';

@ApiTags('Customer Authenticate')
@Controller('customer-auth')
export class UserAuthController {
  constructor(private readonly cusAuthService: CustomerAuthService) {}

  @Post('/login')
  @ApiOperation({ summary: 'Customer login' })
  @ApiResponse({
    status: 200,
    type: CustomerSession,
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @UseGuards(CustomerLoginInput)
  @DecryptFields<CustomerLoginInput>('email', 'password')
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

  @Throttle({
    default: REQUEST_LIMIT_RATE.register,
  })
  @Post('/register')
  @ApiOperation({ summary: 'Register Account' })
  @ApiResponse({
    status: 200,
    description: 'Successful register',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @UseGuards(CustomerDecryptGuard)
  @DecryptFields<CustomerRegisterInput>('email', 'password')
  @HttpCode(HttpStatus.OK)
  async register(@Body() registerDto: CustomerRegisterInput) {
    return this.cusAuthService.register(registerDto);
  }

  @Throttle({
    default: REQUEST_LIMIT_RATE.register,
  })
  @Post('/verify-email')
  @ApiOperation({ summary: 'Verify Email' })
  @ApiResponse({
    status: 200,
    description: 'Successful verify email',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @UseGuards(CustomerDecryptGuard)
  @DecryptFields<CustomerVerifyEmailInput>('email', 'otp')
  @HttpCode(HttpStatus.OK)
  async verifyEmail(@Body() verifyDto: CustomerVerifyEmailInput) {
    return this.cusAuthService.verifyEmail(verifyDto.email, verifyDto.otp);
  }

  @Throttle({
    default: REQUEST_LIMIT_RATE.register,
  })
  @Post('/refresh-verify-email')
  @ApiOperation({ summary: 'Refresh Verify Email' })
  @ApiResponse({
    status: 200,
    description: 'Successful Refresh Verify Email',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @UseGuards(CustomerDecryptGuard)
  @DecryptFields<RefreshOtpInput>('email')
  @HttpCode(HttpStatus.OK)
  async refreshVerifyEmail(@Body() verifyDto: CustomerVerifyEmailInput) {
    return this.cusAuthService.refreshVerifyEmail(verifyDto.email);
  }
}

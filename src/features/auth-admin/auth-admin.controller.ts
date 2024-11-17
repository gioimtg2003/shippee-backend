import { REQUEST_LIMIT_RATE } from '@constants';
import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { AuthAdminService } from './auth-admin.service';
import { AdminLoginInput } from './dto';
import { LoginResponseDto } from './dto/login-response.dto';

@Controller('auth-admin')
export class AuthAdminController {
  constructor(private readonly authAdminService: AuthAdminService) {}

  @Throttle({
    default: REQUEST_LIMIT_RATE.login,
  })
  @Post('login')
  @ApiOperation({ summary: 'Admin user login' })
  @ApiResponse({
    status: 200,
    description: 'Successful login',
    type: LoginResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @HttpCode(HttpStatus.OK)
  login(@Body() data: AdminLoginInput) {
    return this.authAdminService.login(data);
  }
}

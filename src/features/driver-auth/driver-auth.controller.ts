import {
  CreateDriverInput,
  ResponseCreateDriverDTO,
} from '@features/driver/dto';
import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { DriverAuthService } from './driver-auth.service';
import { DriverLoginInput } from './dto';

@ApiTags('Driver Auth')
@Controller('driver-auth')
export class DriverAuthController {
  constructor(private readonly driverAuthService: DriverAuthService) {}

  @ApiOperation({ summary: 'Register Partner' })
  @ApiResponse({
    status: 201,
    description: 'Register Partner',
    type: ResponseCreateDriverDTO,
  })
  @Post('register')
  @HttpCode(HttpStatus.OK)
  async register(@Body() data: CreateDriverInput) {
    return this.driverAuthService.register(data);
  }

  @Post('login')
  @ApiOperation({ summary: 'Customer login' })
  @ApiResponse({
    status: 200,
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: DriverLoginInput) {
    return this.driverAuthService.login(loginDto);
  }
}

import {
  ClientLoginResponseDto,
  DriverLoginNotVerifyResponseDto,
  DriverSession,
} from '@common/dto';
import { JWT_TYPE_ENUM, REQUEST_LIMIT_RATE } from '@constants';
import { ApiObjectResponse, CurrentUser, JwtSecretType } from '@decorators';
import { CreateDriverInput } from '@features/driver/dto';
import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiHeader,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { DriverAuthService } from './driver-auth.service';
import { DriverLoginInput } from './dto';
import { DriverAuthGuard } from './guards';

@ApiTags('Driver Auth')
@Controller('driver-auth')
export class DriverAuthController {
  constructor(private readonly driverAuthService: DriverAuthService) {}

  @ApiOperation({ summary: 'Register Partner' })
  @ApiObjectResponse(
    DriverLoginNotVerifyResponseDto,
    'Driver register success but not verify',
  )
  @Post('register')
  @HttpCode(HttpStatus.OK)
  @Throttle({ default: REQUEST_LIMIT_RATE.register })
  async register(@Body() data: CreateDriverInput) {
    return this.driverAuthService.register(data);
  }

  @Post('login')
  @ApiOperation({ summary: 'Driver login' })
  @ApiObjectResponse(ClientLoginResponseDto)
  @ApiObjectResponse(
    DriverLoginNotVerifyResponseDto,
    'Driver login success but not verify',
  )
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: DriverLoginInput) {
    return this.driverAuthService.login(loginDto);
  }

  @ApiOperation({ summary: 'Refresh token for driver' })
  @Post('refresh-token')
  @ApiObjectResponse(ClientLoginResponseDto)
  @ApiHeader({ name: 'Authorization', description: 'Bearer token' })
  @UseGuards(DriverAuthGuard)
  @JwtSecretType(JWT_TYPE_ENUM.REFRESH)
  @HttpCode(HttpStatus.OK)
  async refreshToken(@CurrentUser() user: DriverSession) {
    return this.driverAuthService.refreshToken(user);
  }
}

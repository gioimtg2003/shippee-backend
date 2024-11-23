import { ClientLoginResponseDto, UserSession } from '@common/dto';
import { CurrentUser } from '@decorators';
import {
  CreateDriverInput,
  ResponseCreateDriverDTO,
} from '@features/driver/dto';
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
import { DriverAuthService } from './driver-auth.service';
import { DriverLoginInput } from './dto';
import { DriverRefreshTokenGuard } from './guards';

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
  @ApiOperation({ summary: 'Driver login' })
  @ApiResponse({
    status: 200,
    type: ClientLoginResponseDto,
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: DriverLoginInput) {
    return this.driverAuthService.login(loginDto);
  }

  @ApiOperation({ summary: 'Refresh token for driver' })
  @ApiResponse({
    status: 200,
    type: ClientLoginResponseDto,
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @Post('refresh-token')
  @UseGuards(DriverRefreshTokenGuard)
  @HttpCode(HttpStatus.OK)
  async refreshToken(@CurrentUser() user: UserSession) {
    return this.driverAuthService.refreshToken(user);
  }
}

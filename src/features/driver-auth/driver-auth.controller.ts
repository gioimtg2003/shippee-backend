import { ClientLoginResponseDto, ResponseDTO, UserSession } from '@common/dto';
import { CurrentUser } from '@decorators';
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
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
  getSchemaPath,
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
    schema: {
      allOf: [
        { $ref: getSchemaPath(ResponseDTO) },
        {
          properties: {
            data: {
              type: 'boolean',
              example: true,
            },
          },
        },
      ],
    },
  })
  @Post('register')
  @HttpCode(HttpStatus.OK)
  async register(@Body() data: CreateDriverInput) {
    return this.driverAuthService.register(data);
  }

  @Post('login')
  @ApiOperation({ summary: 'Driver login' })
  @ApiOkResponse({
    description: 'Refresh Login success',
    schema: {
      allOf: [
        { $ref: getSchemaPath(ResponseDTO) },
        {
          properties: {
            data: {
              type: 'object',
              $ref: getSchemaPath(ClientLoginResponseDto),
            },
          },
        },
      ],
    },
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: DriverLoginInput) {
    return this.driverAuthService.login(loginDto);
  }

  @ApiOperation({ summary: 'Refresh token for driver' })
  @Post('refresh-token')
  @ApiOkResponse({
    description: 'Refresh token for driver',
    schema: {
      allOf: [
        { $ref: getSchemaPath(ResponseDTO) },
        {
          properties: {
            data: {
              type: 'object',
              $ref: getSchemaPath(ClientLoginResponseDto),
            },
          },
        },
      ],
    },
  })
  @UseGuards(DriverRefreshTokenGuard)
  @HttpCode(HttpStatus.OK)
  async refreshToken(@CurrentUser() user: UserSession) {
    return this.driverAuthService.refreshToken(user);
  }
}

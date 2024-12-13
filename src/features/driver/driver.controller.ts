import { DriverSession } from '@common/dto';
import { JWT_TYPE_ENUM } from '@constants';
import {
  ApiObjectResponse,
  ApiSuccessResponse,
  CurrentUser,
  JwtSecretType,
} from '@decorators';
import { DriverAuthGuard } from '@features/driver-auth/guards';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { DriverIdentityService } from './driver-identity.service';
import { DriverService } from './driver.service';
import { UpdateDriverInfoInput } from './dto/update-driver-info.input';

@Controller('driver')
export class DriverController {
  constructor(
    private readonly driverService: DriverService,
    private readonly driverIdentityService: DriverIdentityService,
  ) {}

  @Post('identity')
  @ApiSuccessResponse('Update driver identity successfully')
  @UseGuards(DriverAuthGuard)
  @JwtSecretType(JWT_TYPE_ENUM.VERIFY)
  @HttpCode(HttpStatus.OK)
  async updateIdentity(
    @Body() data: UpdateDriverInfoInput,
    @CurrentUser() user: any,
  ) {
    const updated = await this.driverIdentityService.update(data, user.id);
    if (updated) {
      return true;
    }
  }

  @Get('me')
  @ApiObjectResponse(DriverSession, 'Driver info')
  @UseGuards(DriverAuthGuard)
  @HttpCode(HttpStatus.OK)
  meProfile(@CurrentUser() user: DriverSession) {
    return this.driverService.meProfile(user.id);
  }

  @Post('verify')
  @ApiOperation({ summary: 'Testing Verify driver' })
  @ApiSuccessResponse('Verify driver successfully')
  @HttpCode(HttpStatus.OK)
  async verifyDriver() {
    return this.driverIdentityService.handleDriverVerifyEvent({ id: 1 });
  }

  @Post('online')
  @ApiOperation({ summary: 'Online driver' })
  @ApiSuccessResponse('Driver online successfully')
  @HttpCode(HttpStatus.OK)
  async onlineDriver() {
    return this.driverService.online(17, {
      lat: 10.826214633301163,
      lng: 106.78031168508443,
    });
  }
}

import { JWT_TYPE_ENUM } from '@constants';
import { ApiSuccessResponse, CurrentUser, JwtSecretType } from '@decorators';
import { DriverAuthGuard } from '@features/driver-auth/guards';
import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
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
}

import { DriverIdentityService } from '@features/driver/driver-identity.service';
import { DriverService } from '@features/driver/driver.service';
import { CreateDriverInput } from '@features/driver/dto';
import { CreateDriverInfoInput } from '@features/driver/dto/create-driver-info.input';
import { UpdateDriverInfoInput } from '@features/driver/dto/update-driver-info.input';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class DriverManageService {
  private readonly logger = new Logger(DriverManageService.name);
  constructor(
    private readonly driverService: DriverService,
    private readonly driverIdentityService: DriverIdentityService,
  ) {}

  async createDriver(data: CreateDriverInput) {
    this.logger.log('Creating driver with data: ' + JSON.stringify(data));
    return this.driverService.create(data);
  }

  async getAllDriver() {
    this.logger.log('Getting all drivers');
    return this.driverService.findAll();
  }

  async createDriverInfo(data: CreateDriverInfoInput) {
    return this.driverIdentityService.create(data);
  }

  async updateDriverInfo(data: UpdateDriverInfoInput) {
    return this.driverIdentityService.update(data);
  }
}

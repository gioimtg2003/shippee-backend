import { DriverService } from '@features/driver/driver.service';
import { CreateDriverInput } from '@features/driver/dto';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class DriverManageService {
  private readonly logger = new Logger(DriverManageService.name);
  constructor(private readonly driverService: DriverService) {}

  async createDriver(data: CreateDriverInput) {
    this.logger.log('Creating driver with data: ' + JSON.stringify(data));
    return this.driverService.create(data);
  }
}

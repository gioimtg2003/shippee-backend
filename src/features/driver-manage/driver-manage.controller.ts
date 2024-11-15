import { Controller } from '@nestjs/common';
import { DriverManageService } from './driver-manage.service';

@Controller('driver-manage')
export class DriverManageController {
  constructor(private readonly driverManageService: DriverManageService) {}
}

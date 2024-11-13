import { Controller } from '@nestjs/common';
import { DriverAuthService } from './driver-auth.service';

@Controller('driver-auth')
export class DriverAuthController {
  constructor(private readonly driverAuthService: DriverAuthService) {}
}

import { Controller } from '@nestjs/common';
import { DriverWalletService } from './driver-wallet.service';

@Controller('driver-wallet')
export class DriverWalletController {
  constructor(private readonly driverWalletService: DriverWalletService) {}
}

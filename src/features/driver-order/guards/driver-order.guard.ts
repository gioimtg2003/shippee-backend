import { DRIVER_STATUS_ENUM } from '@constants';
import { RedisCacheService } from '@features/redis';
import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
} from '@nestjs/common';

@Injectable()
export class DriverOrderGuard implements CanActivate {
  private readonly logger = new Logger(DriverOrderGuard.name);

  constructor(private readonly cacheService: RedisCacheService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const driver = req.user;

    if (driver['state'] !== DRIVER_STATUS_ENUM.FREE) {
      this.logger.error('Driver is not free time');
      throw new BadRequestException('Driver is not free');
    }

    return true;
  }
}

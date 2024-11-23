import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { IUserSessionProps } from '@common/interfaces';
import { Role } from '@constants';
import { extractTokenFromHeader } from '@utils';

@Injectable()
export class DriverRefreshTokenGuard implements CanActivate {
  private readonly logger = new Logger(DriverRefreshTokenGuard.name);

  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const token = extractTokenFromHeader(req);

    if (!token) {
      this.logger.debug('No JWT token found');
      throw new UnauthorizedException('Refresh Token not found!');
    }

    try {
      const payload = await this.jwtService.verify<IUserSessionProps>(token, {
        secret: process.env.JWT_SECRET_REFRESH_TOKEN,
      });
      req.user = payload;

      const driver = payload;

      if (driver.role !== Role.DRIVER) {
        this.logger.error(
          'Access denied. User does not have the Shipper role.',
        );
        throw new ForbiddenException(
          'Access denied. User does not have the Shipper role.',
        );
      }
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }

    return true;
  }
}
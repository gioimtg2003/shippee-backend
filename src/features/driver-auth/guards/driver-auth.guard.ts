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
import { JWT, Role } from '@constants';
import { JWT_SECRET_TYPE } from '@decorators';
import { Reflector } from '@nestjs/core';
import { extractTokenFromHeader } from '@utils';

@Injectable()
export class DriverAuthGuard implements CanActivate {
  private readonly logger = new Logger(DriverAuthGuard.name);

  constructor(
    private readonly jwtService: JwtService,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const token = extractTokenFromHeader(req);

    if (!token) {
      this.logger.debug('No JWT token found');
      throw new UnauthorizedException('Token not found!');
    }

    try {
      const jwtSecretType =
        this.reflector.get<JWT_SECRET_TYPE>(
          JWT_SECRET_TYPE,
          context.getHandler(),
        ) || 'access';

      const payload = await this.jwtService.verify<IUserSessionProps>(token, {
        secret: JWT[jwtSecretType],
      });
      req.user = payload;

      const customer = payload;

      if (customer.role !== Role.DRIVER) {
        this.logger.error(
          'Access denied. User does not have the Shipper role.',
        );
        throw new ForbiddenException(
          'Access denied. User does not have the Shipper role.',
        );
      }
    } catch {
      throw new UnauthorizedException('Invalid token');
    }

    return true;
  }
}

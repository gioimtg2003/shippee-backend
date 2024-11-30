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
import { JWT_TYPE_ENUM, Role } from '@constants';
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
    const JWT: { [key in JWT_TYPE_ENUM]: string } = {
      [JWT_TYPE_ENUM.ACCESS]: process.env.JWT_SECRET,
      [JWT_TYPE_ENUM.REFRESH]: process.env.JWT_SECRET_REFRESH_TOKEN,
      [JWT_TYPE_ENUM.VERIFY]: process.env.JWT_SECRET_VERIFY,
    };

    const req = context.switchToHttp().getRequest();
    const token = extractTokenFromHeader(req);

    if (!token) {
      this.logger.debug('No JWT token found');
      throw new UnauthorizedException('Token not found!');
    }

    try {
      const jwtSecretType =
        this.reflector.get<JWT_TYPE_ENUM>(
          JWT_SECRET_TYPE,
          context.getHandler(),
        ) || JWT_TYPE_ENUM.ACCESS;

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

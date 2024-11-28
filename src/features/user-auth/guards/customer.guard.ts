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
import { JWT, JWT_TYPE_ENUM, Role } from '@constants';
import { JWT_SECRET_TYPE } from '@decorators';
import { Reflector } from '@nestjs/core';
import { extractTokenFromHeader } from '@utils';

@Injectable()
export class CustomerGuard implements CanActivate {
  readonly logger = new Logger(CustomerGuard.name);
  constructor(
    private readonly jwtService: JwtService,
    private readonly reflector: Reflector,
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
        this.reflector.get<JWT_TYPE_ENUM>(
          JWT_SECRET_TYPE,
          context.getHandler(),
        ) || JWT_TYPE_ENUM.ACCESS;

      const payload = await this.jwtService.verify<IUserSessionProps>(token, {
        secret: JWT[jwtSecretType],
      });
      req.user = payload;

      const customer = payload;

      if (customer.role !== Role.CUSTOMER) {
        this.logger.error(
          'Access denied. User does not have the Customer role.',
        );
        throw new ForbiddenException(
          'Access denied. User does not have the Customer role.',
        );
      }
    } catch {
      throw new UnauthorizedException('Invalid token');
    }

    return true;
  }
}

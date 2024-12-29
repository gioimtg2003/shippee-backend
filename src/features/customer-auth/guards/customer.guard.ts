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
import { extractTokenFromBody, extractTokenFromHeader } from '@utils';

@Injectable()
export class CustomerGuard implements CanActivate {
  readonly logger = new Logger(CustomerGuard.name);
  constructor(
    private readonly jwtService: JwtService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const JWT: { [key in JWT_TYPE_ENUM]: string } = {
      [JWT_TYPE_ENUM.ACCESS]: process.env.JWT_SECRET,
      [JWT_TYPE_ENUM.REFRESH]: process.env.JWT_SECRET_REFRESH_TOKEN,
      [JWT_TYPE_ENUM.VERIFY]: process.env.JWT_SECRET_VERIFY,
    };

    const req = context.switchToHttp().getRequest();

    try {
      const jwtSecretType =
        this.reflector.get<JWT_TYPE_ENUM>(
          JWT_SECRET_TYPE,
          context.getHandler(),
        ) || JWT_TYPE_ENUM.ACCESS;

      let token = '';
      if (jwtSecretType === JWT_TYPE_ENUM.ACCESS) {
        token = extractTokenFromHeader(req);
      } else {
        token = extractTokenFromBody(req);
      }

      if (!token) {
        this.logger.debug('No JWT token found');
        throw new UnauthorizedException('Token not found!');
      }
      const payload = await this.jwtService.verify<IUserSessionProps>(token, {
        secret: JWT[jwtSecretType],
      });

      if (payload.role !== Role.CUSTOMER) {
        this.logger.error(
          'Access denied. User does not have the Customer role.',
        );
        throw new ForbiddenException(
          'Access denied. User does not have the Customer role.',
        );
      }
      req.user = payload;
    } catch {
      throw new UnauthorizedException('Invalid token');
    }

    return true;
  }
}

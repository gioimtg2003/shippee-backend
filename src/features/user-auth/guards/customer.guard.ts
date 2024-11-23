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
export class CustomerGuard implements CanActivate {
  readonly logger = new Logger(CustomerGuard.name);
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const token = extractTokenFromHeader(req);

    if (!token) {
      this.logger.debug('No JWT token found');
      throw new UnauthorizedException('Access Token not found!');
    }

    try {
      const payload = await this.jwtService.verify<IUserSessionProps>(token, {
        secret: process.env.JWT_SECRET,
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

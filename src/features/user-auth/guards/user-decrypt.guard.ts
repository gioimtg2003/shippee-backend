import { CryptoService } from '@features/crypto';
import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { Observable } from 'rxjs';

@Injectable()
export class UserDecryptGuard implements CanActivate {
  private readonly logger = new Logger(UserDecryptGuard.name);
  private readonly MAX_REQUEST_TIME = 30 * 1000;
  constructor(
    private readonly cryptoService: CryptoService,
    private readonly reflector: Reflector,
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    throw new Error('Method not implemented.');
  }

  extraBody(req: Request, keys: string[]) {
    const body = req.body;

    for (const key of keys) {
      if (!body[key]) {
        throw new BadRequestException(`Invalid payload request`);
      }
    }
    const { requestId } = body;
    if (!requestId) {
      throw new BadRequestException(`Invalid payload request`);
    }

    const [, timestamp] = requestId.split('|');
    if (!timestamp) {
      throw new BadRequestException(`Invalid payload request`);
    }

    if (Date.now() - Number(timestamp) > this.MAX_REQUEST_TIME) {
      throw new BadRequestException(`Request has expired`);
    }

    return Object.keys(body).reduce((acc, key) => {
      if (keys.includes(key)) {
        acc[key] = this.cryptoService.decrypt(body[key]);
      } else {
        acc[key] = body[key];
      }
      return acc;
    }, {});
  }
}

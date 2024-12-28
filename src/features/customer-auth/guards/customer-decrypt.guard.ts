import { DECRYPT_FIELDS_KEY } from '@decorators';
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
import { omit } from 'lodash';
import { stringify } from 'qs';
import { Observable } from 'rxjs';

@Injectable()
export class CustomerDecryptGuard implements CanActivate {
  private readonly logger = new Logger(CustomerDecryptGuard.name);
  private readonly MAX_REQUEST_TIME = 30 * 1000;

  constructor(
    private readonly cryptoService: CryptoService,
    private readonly reflector: Reflector,
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    this.logger.debug('Decrypting request');

    const req = context.switchToHttp().getRequest();
    if (!req.body['encrypted']) {
      throw new BadRequestException(`Invalid payload request`);
    }
    const hashFields =
      this.reflector.get<string[]>(DECRYPT_FIELDS_KEY, context.getHandler()) ||
      [];

    const data = this.extractAndValidateBody(req, hashFields);
    req.body = data;

    return true;
  }

  private extractAndValidateBody(
    req: Request,
    keys: string[],
  ): Record<string, any> {
    const body = req.body;
    const decryptedData = this.cryptoService.decryptRsa(body['encrypted']);
    if (!decryptedData) {
      throw new BadRequestException('Invalid payload request');
    }
    let data: Record<string, any>;
    try {
      data = JSON.parse(decryptedData);
    } catch (error) {
      this.logger.error('Failed to parse decrypted data', error);
      throw new BadRequestException('Invalid payload request');
    }

    this.validateData(data, keys);
    return this.filterData(data, keys);
  }

  private validateData(data: Record<string, any>, keys: string[]): void {
    for (const key of keys) {
      if (!data[key]) {
        throw new BadRequestException('Invalid payload request');
      }
    }

    const { requestId, signature } = data;
    if (!requestId || !requestId.includes('|') || !signature) {
      throw new BadRequestException('Invalid payload request');
    }

    const [, timestamp] = requestId.split('|');
    if (!timestamp || Date.now() - Number(timestamp) > this.MAX_REQUEST_TIME) {
      throw new BadRequestException('Request has expired');
    }

    const hashedData = omit(data, ['signature']);
    const isSignatureValid = this.cryptoService.compareHash256(
      stringify(hashedData, {
        arrayFormat: 'repeat',
        sort: (a, b) => a.localeCompare(b),
      }),
      signature,
    );
    if (!isSignatureValid) {
      throw new BadRequestException('Invalid payload request');
    }
  }

  private filterData(
    data: Record<string, any>,
    keys: string[],
  ): Record<string, any> {
    return keys.reduce(
      (acc, key) => {
        if (data[key]) {
          acc[key] = data[key];
        }
        return acc;
      },
      {} as Record<string, any>,
    );
  }
}

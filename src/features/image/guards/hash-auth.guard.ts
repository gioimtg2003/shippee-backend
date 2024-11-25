import { CryptoService } from '@features/crypto';
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class HashAuthGuard implements CanActivate {
  private readonly logger = new Logger(HashAuthGuard.name);

  constructor(private readonly cryptoService: CryptoService) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    this.logger.log('Checking hash auth');

    const request = context.switchToHttp().getRequest();
    const hash = request?.headers?.['x-shipppee-sha-256'];
    const requestTime = request?.headers?.['x-shipppee-timestamp'];
    if (!hash || !requestTime) {
      throw new UnauthorizedException('Not authorized');
    }

    const { fileName } = request.body;

    const currentTime = Date.now();
    const timeWindow = 30 * 1000;

    if (currentTime - requestTime > timeWindow) {
      throw new UnauthorizedException('Request is expired');
    }

    const dataToHash = `${fileName}${requestTime}${process.env.HASH_SECRET_KEY}`;
    const compare = this.cryptoService.compareHash256(dataToHash, hash);
    if (!compare) {
      throw new UnauthorizedException('Not authorized');
    }

    this.logger.log('Hash auth passed successfully: ' + compare);

    return true;
  }
}

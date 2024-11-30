import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
} from '@nestjs/common';
import { extractApiKeyFromHeader } from '@utils';

@Injectable()
export class PaymentWebhookGuard implements CanActivate {
  private readonly logger = new Logger(PaymentWebhookGuard.name);

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();

    const apiKey = extractApiKeyFromHeader(req);
    if (!apiKey) {
      this.logger.warn('Missing API key');
      throw new BadRequestException('Missing API key');
    }

    if (apiKey !== process.env.WEBHOOK_API_KEY) {
      this.logger.warn('Invalid API key');
      throw new BadRequestException('Invalid API key');
    }

    return true;
  }
}

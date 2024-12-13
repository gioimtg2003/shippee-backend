import { WALLET_STATUS_ENUM } from '@constants';
import { DriverWalletService } from '@features/driver-wallet/driver-wallet.service';
import {
  UpdateWalletEvent,
  WALLET_EVENTS,
} from '@features/driver-wallet/events';
import { Logger } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WebhookDto } from './dto/webhook.dto';
import { TransactionEntity } from './entities/transaction.entity';

export class PaymentService {
  private readonly logger = new Logger(PaymentService.name);
  constructor(
    @InjectRepository(TransactionEntity)
    private readonly repo: Repository<TransactionEntity>,
    private readonly driverWalletService: DriverWalletService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async create(data: WebhookDto) {
    const created = this.repo.create(data);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const saved = await this.repo.save(created);

    const splitCode = saved.code.split('OD')[1];

    if (splitCode) {
      const transaction = await this.driverWalletService.findOneByField({
        code: splitCode,
      });

      if (
        transaction &&
        transaction.status === WALLET_STATUS_ENUM.PENDING &&
        data.transferAmount === transaction.amount
      ) {
        this.logger.log(
          `Updating wallet history status for transaction ${transaction.id}`,
        );
        this.eventEmitter.emit(
          WALLET_EVENTS.UPDATE_WALLET,
          new UpdateWalletEvent({
            id: transaction.id,
            status: WALLET_STATUS_ENUM.ACCEPT,
          }),
        );
      } else {
        this.logger.error(
          `Transaction with code ${splitCode} not found or invalid amount`,
        );
      }
    }

    return true;
  }
}

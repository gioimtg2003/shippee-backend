import { WALLET_STATUS_ENUM } from '@constants';
import { DriverService } from '@features/driver/driver.service';
import { RedisEvents } from '@features/redis/events';
import { UpdateCacheValueEvent } from '@features/redis/events/update-value.event';
import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import { generateRandomCode } from '@utils';
import { DataSource, FindOptionsWhere, Repository } from 'typeorm';
import { TransactionInput } from './dto';
import { WalletHistoryEntity } from './entities';
import { UpdateWalletEvent, WALLET_EVENTS } from './events';

@Injectable()
export class DriverWalletService {
  private readonly logger = new Logger(DriverWalletService.name);
  constructor(
    @InjectRepository(WalletHistoryEntity)
    private readonly repo: Repository<WalletHistoryEntity>,
    private readonly driverService: DriverService,
    private readonly dataSource: DataSource,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async create(id: number, data: TransactionInput) {
    this.logger.log(`Creating wallet history for driver ${id}`);
    const driver = await this.driverService.findById(id);
    if (!driver) {
      this.logger.error(`Driver with id ${id} not found`);
      throw new BadRequestException('Driver not found');
    }

    const code = await this.makeUniqueCode(id);
    const created = this.repo.create({
      ...data,
      code: code,
      driver: { id },
    });

    return this.repo.save(created);
  }

  async findByCodeWithDriver(code: string, id: number) {
    this.logger.log(`Finding wallet history by code ${code}`);
    return this.findOneByField({ code, driver: { id } });
  }

  async findOneByField(
    where: FindOptionsWhere<WalletHistoryEntity>,
    relations: string[] = [],
  ) {
    return this.repo.findOne({
      where,
      relations,
    });
  }

  async findByIdDriver(id: number) {
    this.logger.log(`Finding wallet history by driver ${id}`);
    return this.repo.find({
      where: { driver: { id } },
      select: [
        'id',
        'amount',
        'code',
        'status',
        'action',
        'createdAt',
        'amount',
      ],
      order: { createdAt: 'DESC' },
    });
  }

  private async makeUniqueCode(driverId?: number): Promise<string> {
    while (true) {
      const where = { code: generateRandomCode(8) };

      if (driverId) {
        where['id'] = driverId;
      }

      const exists = await this.repo.findOne({ where });
      if (!exists) {
        return where.code;
      }
    }
  }

  @OnEvent(WALLET_EVENTS.UPDATE_WALLET)
  async updateStatus({ data }: UpdateWalletEvent) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const { id, status } = data;
      const found = await queryRunner.manager.findOne(WalletHistoryEntity, {
        where: { id: id },
        relations: ['driver'],
        select: ['id', 'status', 'amount', 'driver'],
      });

      if (!found) {
        this.logger.error(`Wallet history with id ${id} not found`);
        return;
      }

      const driver = await this.driverService.findById(
        found.driver.id,
        [],
        ['balance', 'id'],
      );

      if (!driver) {
        this.logger.error(`Driver with id ${found.driver.id} not found`);
        return;
      }
      found.status = status;
      await queryRunner.manager.save(WalletHistoryEntity, found);

      if (found.status === WALLET_STATUS_ENUM.ACCEPT) {
        this.logger.log(
          `Driver ${driver.id} balance updated with amount ${found.amount}`,
        );
        this.logger.log(
          `Driver ${driver.id} current balance is ${driver.balance}`,
        );
        driver.balance += found.amount;
        await queryRunner.manager.update('drivers', driver.id, {
          balance: driver.balance,
        });
      }

      await queryRunner.commitTransaction();

      this.eventEmitter.emit(
        RedisEvents.UPDATE_VALUE,
        new UpdateCacheValueEvent(`driver:${driver.id}`, {
          balance: driver.balance,
        }),
      );
      this.logger.log(`Wallet history status updated for transaction ${id}`);
    } catch (error) {
      await queryRunner.rollbackTransaction();

      this.logger.error(`Error updating wallet history status: ${error}`);
    } finally {
      await queryRunner.release();
    }
  }
}

import { DRIVER_STATUS_ENUM } from '@constants';
import { RedisCacheService } from '@features/redis';
import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DriverEntity } from '../entities';
import { CommandDriver, IDataCommandDriver } from './command.interface';

@Injectable()
export class DriverOfflineCommand implements CommandDriver {
  private readonly logger = new Logger(DriverOfflineCommand.name);

  constructor(
    @InjectRepository(DriverEntity)
    private readonly repo: Repository<DriverEntity>,
    private readonly cacheService: RedisCacheService,
  ) {}

  async execute(data: IDataCommandDriver): Promise<void> {
    this.logger.log(`Driver online ${data.idDriver}`);
    const found = await this.repo.findOne({
      where: { id: data.idDriver },
      select: {
        id: true,
        state: true,
      },
    });

    if (!found) {
      this.logger.error(`Driver not found ${data.idDriver}`);
      throw new BadRequestException('Driver not found');
    }

    if (found.state === DRIVER_STATUS_ENUM.DELIVERY) {
      this.logger.error('⚠️ Driver is in delivery state');
      throw new BadRequestException('Driver is in delivery state');
    }

    await this.repo.update(
      { id: data.idDriver },
      { state: DRIVER_STATUS_ENUM.OFFLINE },
    );

    await this.cacheService.updateObject({
      key: `driver:${data.idDriver}`,
      value: {
        state: DRIVER_STATUS_ENUM.OFFLINE,
      },
    });
  }
}

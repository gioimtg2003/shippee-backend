import { CryptoService } from '@features/crypto';
import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  FindOptionsSelectByString,
  FindOptionsWhere,
  Repository,
} from 'typeorm';
import { CreateDriverInput } from './dto/create-driver.input';
import { DriverEntity } from './entities';

@Injectable()
export class DriverService {
  private readonly logger = new Logger(DriverService.name);
  constructor(
    @InjectRepository(DriverEntity)
    private readonly driverRepo: Repository<DriverEntity>,
    private readonly cryptoService: CryptoService,
  ) {}

  private exists(where: FindOptionsWhere<DriverEntity> = {}) {
    return this.driverRepo.findOne({
      where,
      select: ['id'],
    });
  }

  count(where: FindOptionsWhere<DriverEntity> = {}) {
    return this.driverRepo.count({ where });
  }

  async findByField<T>(
    where: FindOptionsWhere<T>,
    relations: string[] = [],
    select: FindOptionsSelectByString<DriverEntity> = [
      'id',
      'name',
      'phone',
      'email',
      'isAiChecked',
      'isIdentityVerified',
      'isRejected',
    ],
  ) {
    this.logger.debug(`Finding driver by ${where}}`);

    const found = await this.driverRepo.findOne({
      where,
      relations,
      select,
    });

    if (!found?.id) {
      this.logger.error('Driver not found');
      throw new BadRequestException('Driver not found');
    }

    return found;
  }

  findAll(
    where: FindOptionsWhere<DriverEntity> = {},
    relations: string[] = [],
  ) {
    return this.driverRepo.find({
      where,
      relations,
      select: [
        'id',
        'name',
        'phone',
        'email',
        'isIdentityVerified',
        'createdAt',
        'transportType',
      ],
    });
  }

  findById(id: number, relations: string[] = []) {
    return this.findByField({ id }, relations);
  }

  findByPhone(phone: string, relations: string[] = []) {
    return this.findByField({ phone }, relations);
  }

  async create(data: CreateDriverInput): Promise<DriverEntity> {
    this.logger.log('Creating driver...');
    const existed = await this.exists({ phone: data.phone, email: data.email });
    if (existed) {
      this.logger.error('⚠️ Driver already exists');
      throw new BadRequestException('Driver already exists');
    }

    data.password = await this.cryptoService.hash(data.password);

    const driver = this.driverRepo.create({
      ...data,
      transportType: {
        id: data.transportTypeId,
      },
    });
    const saved = await this.driverRepo.save(driver);

    if (!saved.id) {
      this.logger.error('⚠️ Error creating driver');
      throw new BadRequestException('Error creating driver');
    }

    return driver;
  }
}

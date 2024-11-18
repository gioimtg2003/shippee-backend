import { CryptoService } from '@features/crypto';
import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
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

  async findByField<T>(where: FindOptionsWhere<T>, relations: string[] = []) {
    this.logger.debug(`Finding driver by ${where}}`);

    const found = await this.driverRepo.findOne({
      where,
      relations,
    });

    if (!found?.id) {
      this.logger.error('Driver not found');
      throw new NotFoundException('Driver not found');
    }

    return found;
  }

  findAll(
    where: FindOptionsWhere<DriverEntity> = {},
    relations: string[] = [],
  ) {
    return this.driverRepo.find({ where, relations });
  }

  findById(id: number, relations: string[] = []) {
    return this.findByField({ id }, relations);
  }

  findByPhone(phone: string) {
    return this.findByField({ phone });
  }

  async create(data: CreateDriverInput): Promise<DriverEntity> {
    this.logger.log('Creating driver...');

    const find = await this.findByPhone(data.phone);

    if (find) {
      this.logger.error('⚠️ Driver already exists');

      throw new BadRequestException(
        'A driver with this phone number already exists',
      );
    }
    data.password = await this.cryptoService.hash(data.password);

    const driver = this.driverRepo.create(data);
    const saved = await this.driverRepo.save(driver);

    if (!saved.id) {
      this.logger.error('⚠️ Error creating driver');
      throw new BadRequestException('Error creating driver');
    }

    return saved;
  }
}

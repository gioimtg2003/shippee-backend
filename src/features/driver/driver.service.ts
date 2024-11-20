import { CryptoService } from '@features/crypto';
import { BadRequestException, Injectable, Logger } from '@nestjs/common';
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
      ],
    });
  }

  findById(id: number, relations: string[] = []) {
    return this.findByField({ id }, relations);
  }

  findByPhone(phone: string) {
    return this.findByField({ phone });
  }

  async create(data: CreateDriverInput): Promise<boolean> {
    this.logger.log('Creating driver...');
    data.password = await this.cryptoService.hash(data.password);

    const driver = this.driverRepo.create(data);
    const saved = await this.driverRepo.save(driver);

    if (!saved.id) {
      this.logger.error('⚠️ Error creating driver');
      throw new BadRequestException('Error creating driver');
    }

    return true;
  }
}

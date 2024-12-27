import { CryptoService } from '@features/crypto';
import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsSelect, FindOptionsWhere, Repository } from 'typeorm';
import { CustomerEntity } from './customer.entity';
import { CreateCustomerInput } from './dto/create-customer.dto';

@Injectable()
export class CustomerService {
  private readonly logger = new Logger(CustomerService.name);
  constructor(
    @InjectRepository(CustomerEntity)
    private readonly cusRepo: Repository<CustomerEntity>,
    // private readonly mailService: MailService,
    //private readonly eventEmitter: EventEmitter2,
    private readonly cryptoService: CryptoService,
  ) {}

  async exists<T>(where: FindOptionsWhere<T>) {
    return this.cusRepo.exists({ where });
  }

  async findByField<T>(
    where: FindOptionsWhere<T>,
    relations: string[] = [],
    selectField: FindOptionsSelect<CustomerEntity> = {},
  ) {
    this.logger.debug(`Finding finder by ${where}}`);

    const found = await this.cusRepo.findOne({
      where,
      relations,
      //slected all fields
      select: selectField,
    });

    if (!found?.id) {
      this.logger.error('Customer not found');
      throw new NotFoundException('Finder not found');
    }

    return found;
  }

  findById(id: number, relations: string[] = []) {
    return this.findByField({ id }, relations);
  }

  findByPhone(phone: string) {
    return this.findByField({ phone });
  }

  findMyProfile(id: number) {
    return this.cusRepo.findOne({
      where: { id },
      select: [],
    });
  }

  findByEmail(
    email: string,
    selectField: FindOptionsSelect<CustomerEntity> = {},
  ) {
    return this.findByField({ email }, [], selectField);
  }

  async create(data: CreateCustomerInput) {
    const isExistedEmail = this.findByEmail(data.email, { id: true });

    if (isExistedEmail) {
      this.logger.error('Email already existed');
      throw new BadRequestException('Email existed');
    }

    data.password = await this.cryptoService.hash(data.password);
    const created = this.cusRepo.create(data);

    const saved = await this.cusRepo.save(created);
    if (!saved.id) {
      this.logger.error('Cannot create customer');
      throw new BadRequestException('Cannot create customer');
    }

    // emit event

    return saved;
  }

  public async updatePassword(cusId: number, newPassword: string) {
    const hashedPassword = await this.cryptoService.hash(newPassword);
    const finder = await this.findById(cusId);
    finder.password = hashedPassword;

    await this.cusRepo.save(finder);
  }

  async delete(finderId: number) {
    await this.findById(finderId);

    await this.cusRepo.softDelete(finderId);
    return true;
  }

  async count() {
    return this.cusRepo.count();
  }
}

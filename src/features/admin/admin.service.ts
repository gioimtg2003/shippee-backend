import { CryptoService } from '@features/crypto';
import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { CreateAdminDto } from './dto/create-admin.dto';
import { AdminEntity } from './entities';

@Injectable()
export class AdminService {
  private readonly logger = new Logger(AdminService.name);

  constructor(
    @InjectRepository(AdminEntity)
    private readonly adminRepo: Repository<AdminEntity>,

    private readonly cryptoService: CryptoService,
  ) {}

  async findByField<T>(where: FindOptionsWhere<T>, relations: string[] = []) {
    this.logger.debug(`Finding admin user by ${where}}`);

    const found = await this.adminRepo.findOne({
      where,
      relations,
    });

    if (!found?.id) {
      this.logger.error('⚠️ Admin not found');
      throw new NotFoundException('Admin not found');
    }

    return found;
  }

  findByUserName(username: string) {
    return this.findByField({ username });
  }

  async create(createAdminDto: CreateAdminDto) {
    createAdminDto.password = await this.cryptoService.hash(
      createAdminDto.password,
    );

    const created = this.adminRepo.create(createAdminDto);

    const saved = await this.adminRepo.save(created);
    if (!saved.id) {
      this.logger.error('⚠️ Cannot create Admin user');
      throw new BadRequestException('Cannot create Admin user');
    }
    return saved;
  }
}

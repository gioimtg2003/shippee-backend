import { Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TransportTypeEntity } from './transport-type.entity';

export class TransportTypeService {
  private readonly logger = new Logger(TransportTypeService.name);

  constructor(
    @InjectRepository(TransportTypeEntity)
    private readonly transportType: Repository<TransportTypeEntity>,
  ) {}

  get() {
    return this.transportType.find();
  }
}

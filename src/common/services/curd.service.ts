import { CoreEntity } from '@common/entities';
import { Injectable, Logger, Type } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

export function CurdService<T extends CoreEntity>(entity: Type<T>) {
  @Injectable()
  class CurdService {
    readonly logger = new Logger(CurdService.name);

    constructor(
      @InjectRepository(entity)
      readonly repository: Repository<T>,
    ) {}
  }

  return CurdService;
}

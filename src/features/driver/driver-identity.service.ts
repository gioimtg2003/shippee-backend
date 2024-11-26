import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DriverService } from './driver.service';
import { CreateDriverInfoInput } from './dto/create-driver-info.input';
import { UpdateDriverInfoInput } from './dto/update-driver-info.input';
import { DriverIdentityEntity } from './entities';

@Injectable()
export class DriverIdentityService {
  private readonly logger = new Logger(DriverIdentityService.name);
  constructor(
    @InjectRepository(DriverIdentityEntity)
    private readonly driverIdentityRepo: Repository<DriverIdentityEntity>,
    private readonly driverService: DriverService,
  ) {}

  async create(data: CreateDriverInfoInput) {
    const driver = await this.driverService.findById(data.idDriver);
    if (!driver) {
      this.logger.error(`⚠️ Driver not found with id: ${data.idDriver}`);

      throw new BadRequestException('Driver not found');
    }

    const driverInfo = this.driverIdentityRepo.create({
      ...data,
      driver: { id: data.idDriver },
    });
    const saved = await this.driverIdentityRepo.save(driverInfo);

    if (!saved.id) {
      this.logger.error('⚠️ Failed to save driver info');
      throw new BadRequestException('Failed to save driver info');
    }

    this.logger.log(`Driver info saved: ${saved.id}`);
    return saved;
  }

  async update(data: UpdateDriverInfoInput) {
    const driverInfo = await this.driverIdentityRepo.findOne({
      where: {
        driver: {
          id: data.idDriver,
        },
      },
    });

    if (!driverInfo) {
      this.logger.error(`⚠️ Driver info not found with id: ${data.idDriver}`);
      throw new BadRequestException('Driver info not found');
    }

    const updated = await this.driverIdentityRepo.save({
      ...driverInfo,
      ...data,
    });

    if (!updated.id) {
      this.logger.error('⚠️ Failed to update driver info');
      throw new BadRequestException('Failed to update driver info');
    }

    this.logger.log(`Driver info updated: ${updated.id}`);
    return updated;
  }
}

import { BUCKET } from '@constants';
import { CryptoService } from '@features/crypto';
import { ImageService } from '@features/image';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import { generatePromptIdentityCard, isValueInFields } from '@utils';
import dayjs from 'dayjs';
import { Repository } from 'typeorm';
import { DriverService } from './driver.service';
import { CreateDriverInfoInput } from './dto/create-driver-info.input';
import { UpdateDriverInfoInput } from './dto/update-driver-info.input';
import { DriverIdentityEntity } from './entities';
import { DRIVER_EVENTS } from './events';
import { DriverVerifyEvent } from './events/driver-verify.event';

@Injectable()
export class DriverIdentityService {
  private readonly logger = new Logger(DriverIdentityService.name);
  constructor(
    @InjectRepository(DriverIdentityEntity)
    private readonly driverIdentityRepo: Repository<DriverIdentityEntity>,
    private readonly driverService: DriverService,
    private readonly eventEmitter: EventEmitter2,
    private readonly imageService: ImageService,
    private readonly cryptoService: CryptoService,
  ) {}

  async create(data: CreateDriverInfoInput) {
    const driver = await this.driverService.findById(data.idDriver);
    if (!driver) {
      this.logger.error(`⚠️ Driver not found with id: ${data.idDriver}`);

      throw new BadRequestException('Driver not found');
    }

    const driverInfo = this.driverIdentityRepo.create({
      ...data,
      driver: { id: driver.id },
    });
    const saved = await this.driverIdentityRepo.save(driverInfo);

    if (!saved.id) {
      this.logger.error('⚠️ Failed to save driver info');
      throw new BadRequestException('Failed to save driver info');
    }

    this.logger.log(`Driver info saved: ${saved.id}`);
    return saved;
  }

  async update(data: UpdateDriverInfoInput, idDriver: number) {
    const driver = await this.driverService.findById(idDriver);
    if (!driver) {
      this.logger.error(`⚠️ Driver not found with id: ${idDriver}`);

      throw new BadRequestException('Driver not found');
    }
    // remember check isAiChecked or isIdentityVerified before update

    if (driver.isAiChecked || driver.isIdentityVerified) {
      this.logger.error(`⚠️ Driver is already checked`);
      throw new BadRequestException('Driver is already verified');
    } else if (driver.isRejected) {
      this.logger.error(`⚠️ Driver is rejected`);
      throw new BadRequestException('Driver is rejected');
    }

    const driverInfo = await this.driverIdentityRepo.findOne({
      where: {
        driver: {
          id: driver.id,
        },
      },
    });

    if (!driverInfo) {
      // Create new driver info if not found
      const created = this.driverIdentityRepo.create({
        ...data,
        driver: { id: driver.id },
      });
      const saved = await this.driverIdentityRepo.save(created);

      if (!saved.id) {
        this.logger.error('⚠️ Failed to create driver info');
        throw new BadRequestException('Failed to create driver info');
      }
      return saved;
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

    this.eventEmitter.emit(
      DRIVER_EVENTS.VERIFY,
      new DriverVerifyEvent(updated.id),
    );
    return updated;
  }

  @OnEvent(DRIVER_EVENTS.VERIFY)
  async handleDriverVerifyEvent({ id }: DriverVerifyEvent) {
    this.logger.log(
      `Starting driver verification for driver identity: ${id} ...`,
    );

    const found = await this.driverIdentityRepo.findOne({
      where: { id },
      relations: ['driver'],
      select: {
        id: true,
        driver: {
          id: true,
        },
        imgDriverLicenseBack: true,
        imgDriverLicenseFront: true,
        imgIdentityCardBack: true,
        imgIdentityCardFront: true,
        imgVehicleRegistrationCertFront: true,
        imgVehicleRegistrationCertBack: true,
      },
    });

    if (!found) {
      this.logger.error(`Driver identity not found with id: ${id}`);
      return;
    }

    const checkUpload = isValueInFields(
      found,
      'imgDriverLicenseBack',
      'imgDriverLicenseFront',
      'imgIdentityCardBack',
      'imgIdentityCardFront',
      'imgVehicleRegistrationCertFront',
      'imgVehicleRegistrationCertBack',
    );

    if (!checkUpload) {
      this.logger.log('Driver has not uploaded identity');
      return;
    }

    const metadata = await this.extractIdentityCardInfo(
      found.imgIdentityCardFront,
    );

    if (!metadata) {
      this.logger.error('Driver identity not found');
      return;
    }

    const { name, identityCardNumber, age } = metadata;
    if (Number(age) < 18) {
      this.logger.error('Driver is underage');
      return;
    }

    await this.driverIdentityRepo.save({
      ...found,
      identityCardNumber: this.cryptoService.encrypt(identityCardNumber),
    });

    await this.driverService.update(found.driver.id, {
      isAiChecked: true,
      name,
    });

    return true;
  }

  private async extractIdentityCardInfo(key: string) {
    this.logger.log(`Extract Identity Card Info: ${key}`);
    const buffer = await this.imageService.readImage(BUCKET.DRIVER, key);
    const image = {
      inlineData: {
        data: await buffer.Body.transformToString('base64'),
        mimeType: buffer.ContentType,
      },
    };

    const googleAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_KEY);
    const model = googleAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const currentDate = dayjs().format('YYYY-MM-DD');
    const prompt = generatePromptIdentityCard(currentDate);

    const result = await model.generateContent([prompt, image]);
    const response = result.response.text().trim();

    if (response === 'Null' || response === 'null') {
      return false;
    }

    this.logger.log(`Extracted Identity Card Info: ${response}`);

    const [name, identityCardNumber, age] = response.split('\n');

    return { name, identityCardNumber, age };
  }
}

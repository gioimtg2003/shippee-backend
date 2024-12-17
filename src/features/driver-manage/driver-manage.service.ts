import { TRANSPORT_TYPE_ENUM } from '@constants';
import { DriverWalletService } from '@features/driver-wallet/driver-wallet.service';
import { WalletPaginateDto } from '@features/driver-wallet/dto';
import { DriverIdentityService } from '@features/driver/driver-identity.service';
import { DriverService } from '@features/driver/driver.service';
import { CreateDriverInput } from '@features/driver/dto';
import { CreateDriverInfoInput } from '@features/driver/dto/create-driver-info.input';
import { UpdateDriverInfoInput } from '@features/driver/dto/update-driver-info.input';
import { UpdateDriverInput } from '@features/driver/dto/update-driver.input';
import { DRIVER_EVENTS, DriverCreateEvent } from '@features/driver/events';
import { ImageService } from '@features/image/image.service';
import { MailService } from '@features/mail/mail.service';
import { TransportTypeService } from '@features/transport-type/transport-type.service';
import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { isValueInFields } from '@utils';
import { FilterDriverOptionsDto } from './dto';
import { CountDriverDto } from './dto/count-driver.dto';

@Injectable()
export class DriverManageService {
  private readonly logger = new Logger(DriverManageService.name);
  constructor(
    private readonly driverService: DriverService,
    private readonly driverIdentityService: DriverIdentityService,
    private readonly eventEmitter: EventEmitter2,
    private readonly mailService: MailService,
    private readonly imageService: ImageService,
    private readonly transportTypeService: TransportTypeService,
    private readonly driverWalletService: DriverWalletService,
  ) {}

  async createDriver(data: CreateDriverInput) {
    this.logger.log('Creating driver with data: ' + JSON.stringify(data));
    const password = data.password;
    const saved = await this.driverService.create(data);

    if (saved) {
      this.eventEmitter.emit(
        DRIVER_EVENTS.CREATED,
        new DriverCreateEvent({
          password: password,
          name: data.name,
          email: data.email,
          phone: data.phone,
        }),
      );
    }

    return saved;
  }

  async getAllDriver(options: FilterDriverOptionsDto) {
    this.logger.log('Getting all drivers');
    return this.driverService.findAll(options);
  }

  async getAllDriverWallet(options: WalletPaginateDto) {
    this.logger.log('Getting all drivers');
    return this.driverWalletService.paginateWallet(options);
  }

  async countDriver(filter: CountDriverDto) {
    return (await this.driverService.count(filter)) + 100;
  }

  async getDriverById(id: number, relations: string[] = []) {
    const driver = await this.driverService.findByField(
      {
        id,
      },
      relations,
      [
        'id',
        'name',
        'email',
        'phone',
        'balance',
        'isIdentityVerified',
        'isAiChecked',
        'isRejected',
        'identity',
        'transportType',
      ],
    );

    if (driver.identity) {
      const imageFields = [
        'imgIdentityCardFront',
        'imgIdentityCardBack',
        'imgDriverLicenseFront',
        'imgDriverLicenseBack',
        'imgVehicleRegistrationCertFront',
        'imgVehicleRegistrationCertBack',
      ];

      await Promise.all(
        imageFields.map(async (field) => {
          if (driver.identity[field]) {
            driver.identity[field] = await this.imageService.getUrlImgDocument(
              driver.identity[field],
            );
          }
        }),
      );
    }

    return driver;
  }

  async createDriverInfo(data: CreateDriverInfoInput) {
    return this.driverIdentityService.create(data);
  }

  async updateDriver(data: UpdateDriverInput) {
    const { id, transportTypeId, ...rest } = data;

    if (transportTypeId) {
      const transportType =
        await this.transportTypeService.findById(transportTypeId);
      if (!transportType) {
        throw new BadRequestException('Transport type not found');
      }

      Object.assign(rest, { transportType });
    }

    const updated = await this.driverService.update(id, rest);
    if (updated) {
      return true;
    }
  }

  async updateDriverInfo(data: UpdateDriverInfoInput, idDriver: number) {
    return this.driverIdentityService.update(data, idDriver);
  }

  async verifyDriver(id: number) {
    const driver = await this.driverService.findByField(
      { id },
      ['identity', 'transportType'],
      {
        id: true,
        identity: {
          imgDriverLicenseFront: true,
          imgDriverLicenseBack: true,
          imgIdentityCardFront: true,
          imgIdentityCardBack: true,
          imgVehicleRegistrationCertFront: true,
          imgVehicleRegistrationCertBack: true,
        },
        transportType: {
          code: true,
        },
      },
    );

    if (!driver) {
      throw new BadRequestException('Driver not found');
    }

    if (!driver.identity) {
      throw new BadRequestException('Driver identity not found');
    }

    if (driver.isIdentityVerified || driver.isAiChecked) {
      throw new BadRequestException('Driver already verified');
    }
    const checkUpload = isValueInFields(
      driver.identity,
      'imgDriverLicenseBack',
      'imgDriverLicenseFront',
      'imgIdentityCardBack',
      'imgIdentityCardFront',
      'imgVehicleRegistrationCertFront',
      'imgVehicleRegistrationCertBack',
    );

    if (!checkUpload) {
      throw new BadRequestException('Driver has not uploaded identity');
    }
    const updateFields = {
      isIdentityVerified: true,
    };

    if (driver.transportType.code === TRANSPORT_TYPE_ENUM.BIKE) {
      Object.assign(updateFields, { isAiChecked: true });
    }
    const updated = await this.driverService.update(driver.id, {
      ...updateFields,
    });

    if (!updated) {
      throw new BadRequestException('Error verifying driver');
    }

    return true;
  }

  async softDeleteDriver(id: number) {
    await this.driverService.softDelete(id);
    return true;
  }

  @OnEvent(DRIVER_EVENTS.CREATED)
  async handleDriverCreatedEvent({ driver }: DriverCreateEvent) {
    this.logger.log(`Driver created: ${driver.name}`);

    if (!driver.email) {
      this.logger.log(`Driver ${driver.name} does not have email`);
      return;
    }

    this.mailService.sendMail({
      to: driver.email,
      subject: 'Tạo tài khoản tài xế thành công',
      template: './manage-create-driver',
      context: {
        name: driver.name,
        phone: driver.phone,
        password: driver.password,
      },
    });
  }
}

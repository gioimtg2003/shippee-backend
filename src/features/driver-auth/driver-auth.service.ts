import { DriverSession, UserSession } from '@common/dto';
import { RegisterJwtService } from '@common/services';
import { EXPIRE_CACHE_DRIVER, Role, TRANSPORT_TYPE_ENUM } from '@constants';
import { CryptoService } from '@features/crypto';
import { DriverService } from '@features/driver/driver.service';
import { CreateDriverInput } from '@features/driver/dto';
import { CacheValueEvent, RedisEvents } from '@features/redis/events';
import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { JwtService } from '@nestjs/jwt';
import { isValueInFields } from '@utils';
import { DriverLoginInput } from './dto';

@Injectable()
export class DriverAuthService extends RegisterJwtService {
  private readonly logger = new Logger(DriverAuthService.name);
  constructor(
    private readonly driverService: DriverService,
    private readonly cryptoService: CryptoService,
    protected readonly jwtService: JwtService,
    private readonly eventEmitter: EventEmitter2,
  ) {
    super(jwtService);
  }

  async register(data: CreateDriverInput) {
    this.logger.log(`Registering driver: ${data.phone}`);
    const driver = await this.driverService.create(data);
    if (driver) {
      return this.generateJwtVerify({ ...driver, role: Role.DRIVER });
    }
  }

  async login(data: DriverLoginInput) {
    this.logger.log(`Phone Login: ${data.phone}`);

    const driver = await this.driverService.findByPhone(data.phone, [
      'transportType',
      'identity',
    ]);

    if (!driver) {
      throw new BadRequestException('Tài khoản không tồn tại');
    }

    const isPasswordValid = await this.cryptoService.compareHash(
      data.password,
      driver.password,
    );

    if (!isPasswordValid) {
      throw new BadRequestException('Mật khẩu không đúng');
    }

    if (driver.identity && !driver.isIdentityVerified && !driver.isAiChecked) {
      const checkUpload = isValueInFields(
        driver.identity,
        'imgDriverLicenseBack',
        'imgDriverLicenseFront',
        'imgIdentityCardBack',
        'imgIdentityCardFront',
        'imgVehicleRegistrationCertFront',
        'imgVehicleRegistrationCertBack',
      );

      if (checkUpload) {
        this.logger.log('Driver has uploaded identity');
        throw new BadRequestException('Vui lòng chờ xác minh thông tin');
      }
    }

    if (driver.transportType.code === TRANSPORT_TYPE_ENUM.BIKE) {
      if (!driver.isAiChecked) {
        this.logger.log('Driver has not been checked by AI');
        return this.generateJwtVerify({ ...driver, role: Role.DRIVER });
      }
    } else {
      if (!driver.isIdentityVerified) {
        return this.generateJwtVerify({ ...driver, role: Role.DRIVER });
      }
    }

    const driverSession: DriverSession = {
      id: driver.id,
      phone: driver.phone,
      email: driver.email,
      name: driver.name,
      role: Role.DRIVER,
      isAiChecked: driver.isAiChecked,
      isIdentityVerified: driver.isIdentityVerified,
    };

    this.eventEmitter.emit(
      RedisEvents.CACHE_VALUE,
      new CacheValueEvent(
        {
          key: `driver:${driver.id}`,
          value: JSON.stringify({
            ...driverSession,
            balance: driver.balance,
          }),
        },
        EXPIRE_CACHE_DRIVER,
      ),
    );

    return this.registerJwt(driverSession);
  }

  async refreshToken(user: UserSession) {
    const driver = await this.driverService.findById(user.id);

    if (!driver) {
      throw new BadRequestException('Tài khoản không tồn tại');
    }

    const driverSession: DriverSession = {
      id: driver.id,
      phone: driver.phone,
      email: driver.email,
      name: driver.name,
      isAiChecked: driver.isAiChecked,
      isIdentityVerified: driver.isIdentityVerified,
      role: Role.DRIVER,
    };

    return this.registerJwt<DriverSession>(driverSession);
  }

  private async generateJwtVerify(data: UserSession) {
    const jwtVerify = await this.registerJwtVerify({
      id: data.id,
      phone: data.phone,
      email: data.email,
      name: data.name,
      role: Role.DRIVER,
    });
    return {
      jwtVerify,
    };
  }
}

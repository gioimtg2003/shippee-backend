import { UserSession } from '@common/dto';
import { RegisterJwtService } from '@common/services';
import { Role, TRANSPORT_TYPE_ENUM } from '@constants';
import { CryptoService } from '@features/crypto';
import { DriverService } from '@features/driver/driver.service';
import { CreateDriverInput } from '@features/driver/dto';
import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { DriverLoginInput } from './dto';

@Injectable()
export class DriverAuthService extends RegisterJwtService {
  private readonly logger = new Logger(DriverAuthService.name);
  constructor(
    private readonly driverService: DriverService,
    private readonly cryptoService: CryptoService,
    protected readonly jwtService: JwtService,
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
    ]);

    if (!driver) {
      throw new BadRequestException('This email is not registered');
    }

    const isPasswordValid = await this.cryptoService.compareHash(
      data.password,
      driver.password,
    );

    if (!isPasswordValid) {
      throw new BadRequestException('Invalid password');
    }

    if (driver.transportType.code === TRANSPORT_TYPE_ENUM.BIKE) {
      if (!driver.isAiChecked) {
        return this.generateJwtVerify({ ...driver, role: Role.DRIVER });
      }
    } else {
      if (!driver.isIdentityVerified) {
        return this.generateJwtVerify({ ...driver, role: Role.DRIVER });
      }
    }

    const driverSession: UserSession = {
      id: driver.id,
      phone: driver.phone,
      email: driver.email,
      name: driver.name,
      role: Role.DRIVER,
    };

    return this.registerJwt(driverSession);
  }

  async refreshToken(user: UserSession) {
    const driver = await this.driverService.findById(user.id);

    if (!driver) {
      throw new BadRequestException('This email is not registered');
    }

    const driverSession: UserSession = {
      id: driver.id,
      phone: driver.phone,
      email: driver.email,
      name: driver.name,
      role: Role.DRIVER,
    };

    return this.registerJwt(driverSession);
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

import { UserSession } from '@common/dto';
import { RegisterJwtService } from '@common/services';
import { Role } from '@constants';
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
    return this.driverService.create(data);
  }

  async login(data: DriverLoginInput) {
    this.logger.log(`Phone Login: ${data.phone}`);

    const driver = await this.driverService.findByPhone(data.phone);

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
}

import { UserSession } from '@common/dto';
import { EXPIRES_ACCESS_TOKEN, EXPIRES_REFRESH_TOKEN, Role } from '@constants';
import { CryptoService } from '@features/crypto';
import { DriverService } from '@features/driver/driver.service';
import { CreateDriverInput } from '@features/driver/dto';
import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { DriverLoginInput } from './dto';

@Injectable()
export class DriverAuthService {
  private readonly logger = new Logger(DriverAuthService.name);
  constructor(
    private readonly driverService: DriverService,
    private readonly cryptoService: CryptoService,
    private readonly jwtService: JwtService,
  ) {}

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
      role: Role.CUSTOMER,
    };

    const accessToken = this.jwtService.sign(driverSession, {
      secret: process.env.JWT_SECRET,
      expiresIn: EXPIRES_ACCESS_TOKEN,
    });

    const refreshToken = this.jwtService.sign(
      {
        ...driverSession,
        aT: true,
      },
      {
        secret: process.env.JWT_SECRET,
        expiresIn: EXPIRES_REFRESH_TOKEN,
      },
    );

    return { ...driverSession, accessToken, refreshToken };
  }
}

import { SelectedUserSessionFields, UserSession } from '@common/dto';
import { EXPIRES_ACCESS_TOKEN, EXPIRES_REFRESH_TOKEN, Role } from '@constants';
import { CryptoService } from '@features/crypto';
import { CustomerService } from '@features/customer/customer.service';
import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CustomerLoginInput } from './dto/customer-login.input';

@Injectable()
export class CustomerAuthService {
  private readonly logger = new Logger(CustomerAuthService.name);

  constructor(
    private readonly cusService: CustomerService,
    private readonly cryptoService: CryptoService,
    private readonly jwtService: JwtService,
  ) {}

  async login(data: CustomerLoginInput) {
    this.logger.log(`Email Login: ${data.email}`);

    const customer = await this.cusService.findByEmail(
      data.email,
      SelectedUserSessionFields,
    );

    if (!customer) {
      throw new BadRequestException('This email is not registered');
    }

    const isPasswordValid = await this.cryptoService.compareHash(
      data.password,
      customer.password,
    );

    if (!isPasswordValid) {
      throw new BadRequestException('Invalid password');
    }

    const userSession: UserSession = {
      email: customer.email,
      id: customer.id,
      name: customer.name,
      role: Role.CUSTOMER,
    };

    const accessToken = this.jwtService.sign(userSession, {
      secret: process.env.JWT_SECRET,
      expiresIn: EXPIRES_ACCESS_TOKEN,
    });

    const refreshToken = this.jwtService.sign(
      {
        ...userSession,
        aT: true,
      },
      {
        secret: process.env.JWT_SECRET,
        expiresIn: EXPIRES_REFRESH_TOKEN,
      },
    );

    return { ...userSession, accessToken, refreshToken };
  }
}

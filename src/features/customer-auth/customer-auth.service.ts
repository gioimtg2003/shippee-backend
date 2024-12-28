import { SelectedUserSessionFields, UserSession } from '@common/dto';
import { EXPIRES_ACCESS_TOKEN, EXPIRES_REFRESH_TOKEN, Role } from '@constants';
import { CryptoService } from '@features/crypto';
import { CustomerService } from '@features/customer/customer.service';
import { MailService } from '@features/mail/mail.service';
import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { JwtService } from '@nestjs/jwt';
import { randOtp } from '@utils';
import { CustomerLoginInput } from './dto/customer-login.input';
import { CustomerRegisterInput } from './dto/customer-register.input';
import { CUSTOMER_AUTH_EVENTS, VerifyEmailCustomerEvent } from './events';

@Injectable()
export class CustomerAuthService {
  private readonly logger = new Logger(CustomerAuthService.name);

  constructor(
    private readonly cusService: CustomerService,
    private readonly cryptoService: CryptoService,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
    private readonly eventEmitter: EventEmitter2,
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

  async register(data: CustomerRegisterInput) {
    this.logger.log(`Email Register: ${data.email}`);

    const otp = randOtp();
    const customer = await this.cusService.create({
      ...data,
      timeOtp: new Date(),
      otp,
    });

    if (customer.id) {
      this.eventEmitter.emit(
        CUSTOMER_AUTH_EVENTS.VERIFY_EMAIL,
        new VerifyEmailCustomerEvent(customer.email, otp),
      );
      return true;
    }
  }

  async verifyEmail(email: string, otp: string) {
    const customer = await this.cusService.findByEmail(email);

    if (!customer) {
      throw new BadRequestException('Email not found');
    }

    if (customer.otp !== otp) {
      throw new BadRequestException('Invalid OTP');
    }

    if (customer.timeOtp < new Date()) {
      throw new BadRequestException('OTP expired');
    }

    customer.emailVerified = true;
    customer.otp = null;
    customer.timeOtp = null;

    await this.cusService.update(customer.id, customer);

    return true;
  }

  @OnEvent(CUSTOMER_AUTH_EVENTS.VERIFY_EMAIL)
  async sendEmailVerify(data: VerifyEmailCustomerEvent) {
    const { email, otp } = data;

    this.mailService.sendMail({
      to: email,
      subject: 'Xác thực Email của bạn',
      template: 'verify-email',
      context: {
        otp,
      },
    });
  }
}

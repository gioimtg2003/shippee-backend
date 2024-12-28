import { CustomerSession, SelectedUserSessionFields } from '@common/dto';
import { RegisterJwtService } from '@common/services';
import { Role } from '@constants';
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
export class CustomerAuthService extends RegisterJwtService {
  private readonly logger = new Logger(CustomerAuthService.name);

  constructor(
    private readonly cusService: CustomerService,
    private readonly cryptoService: CryptoService,
    protected readonly jwtService: JwtService,
    private readonly mailService: MailService,
    private readonly eventEmitter: EventEmitter2,
  ) {
    super(jwtService);
  }

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

    const userSession: CustomerSession = {
      email: customer.email,
      id: customer.id,
      name: customer.name,
      role: Role.CUSTOMER,
    };

    return this.registerJwt<CustomerSession>(userSession);
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

    if (customer.timeOtp.getTime() + 10 * 60 * 1000 < new Date().getTime()) {
      throw new BadRequestException('OTP expired');
    }

    customer.emailVerified = true;
    customer.otp = null;
    customer.timeOtp = null;

    await this.cusService.update(customer.id, customer);

    return true;
  }

  async refreshVerifyEmail(email: string) {
    const customer = await this.cusService.findByEmail(email);

    if (!customer) {
      throw new BadRequestException('Email not found');
    }

    const otp = randOtp();
    customer.otp = otp;
    customer.timeOtp = new Date();

    await this.cusService.update(customer.id, customer);

    this.eventEmitter.emit(
      CUSTOMER_AUTH_EVENTS.VERIFY_EMAIL,
      new VerifyEmailCustomerEvent(customer.email, otp),
    );

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

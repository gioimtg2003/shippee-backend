import { CustomerSession, DriverSession } from '@common/dto';
import { RegisterJwtService } from '@common/services';
import { Role, TRANSPORT_TYPE_ENUM } from '@constants';
import { CryptoService } from '@features/crypto';
import { DriverService } from '@features/driver/driver.service';
import { CreateDriverInput } from '@features/driver/dto';
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

  /**
   * Logs in a driver using their phone number and password.
   *
   * @param {DriverLoginInput} data - The login input containing the phone number and password.
   * @returns {Promise<string>} - A promise that resolves to a JWT token if login is successful.
   * @throws {BadRequestException} - If the driver account does not exist, the password is incorrect,
   * or the driver's identity is not verified.
   *
   * The function performs the following steps:
   * 1. Logs the phone number attempting to log in.
   * 2. Finds the driver by phone number, including related transport type and identity information.
   * 3. Throws an exception if the driver does not exist.
   * 4. Validates the provided password against the stored password hash.
   * 5. Throws an exception if the password is incorrect.
   * 6. Checks if the driver's identity has been uploaded but not verified, and throws an exception if so.
   * 7. For bike transport type, checks if the driver has been AI-verified and returns a JWT token for verification if not.
   * 8. For other transport types, checks if the driver's identity is verified and returns a JWT token for verification if not.
   * 9. Creates a driver session object with relevant driver details.
   * 10. Emits an event to cache the driver session with a specified expiration time.
   * 11. Returns a JWT token for the registered driver session.
   */
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

    return this.registerJwt(driverSession);
  }

  /**
   * Refreshes the JWT token for a given user session.
   *
   * @param {UserSession} user - The user session containing the user's ID.
   * @returns {Promise<string>} A promise that resolves to the new JWT token.
   * @throws {BadRequestException} If the driver does not exist.
   */
  async refreshToken(user: DriverSession) {
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

  /**
   * Generates a JWT verification token for a given user session.
   *
   * @param {UserSession} data - The user session data containing user details.
   * @returns {Promise<{ jwtVerify: string }>} - An object containing the generated JWT verification token.
   * @private
   */
  private async generateJwtVerify(data: CustomerSession) {
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

import { EXPIRES_TOKEN_ADMIN_AUTH, Role } from '@constants';
import { AdminService } from '@features/admin/admin.service';
import { CryptoService } from '@features/crypto';
import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AdminLoginInput } from './dto';

@Injectable()
export class AuthAdminService {
  private readonly logger = new Logger(AuthAdminService.name);
  constructor(
    private readonly adminService: AdminService,
    private readonly cryptoService: CryptoService,
    private readonly jwtService: JwtService,
  ) {}

  async login(data: AdminLoginInput) {
    const admin = await this.adminService.findByUserName(data.username);
    if (!admin) {
      this.logger.error('⚠️ Admin user not found');
      throw new BadRequestException('Admin not found');
    }

    const isPasswordValid = await this.cryptoService.compareHash(
      data.password,
      admin.password,
    );

    if (!isPasswordValid) {
      this.logger.error('Invalid password');
      throw new BadRequestException('Invalid password');
    }

    const token = this.jwtService.sign(
      { id: admin.id, username: admin.username, role: Role.ADMIN },
      {
        secret: process.env.JWT_SECRET,
        expiresIn: EXPIRES_TOKEN_ADMIN_AUTH,
      },
    );

    return { token };
  }
}

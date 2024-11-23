import { UserSession } from '@common/dto';
import { EXPIRES_ACCESS_TOKEN, EXPIRES_REFRESH_TOKEN } from '@constants';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class RegisterJwtService {
  constructor(protected readonly jwtService: JwtService) {}

  async registerJwt(data: UserSession) {
    const accessToken = this.jwtService.sign(data, {
      secret: process.env.JWT_SECRET,
      expiresIn: EXPIRES_ACCESS_TOKEN,
    });

    const refreshToken = this.jwtService.sign(
      {
        ...data,
      },
      {
        secret: process.env.JWT_SECRET_REFRESH_TOKEN,
        expiresIn: EXPIRES_REFRESH_TOKEN,
      },
    );

    return {
      accessToken,
      refreshToken,
      expiresIn: Math.floor(Date.now() + EXPIRES_ACCESS_TOKEN * 1000 - 10000),
    };
  }
}

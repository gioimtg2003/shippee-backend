import { ApiObjectResponse, CurrentUser } from '@decorators';
import { DriverAuthGuard } from '@features/driver-auth/guards';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { generateUrlQrCode } from '@utils';
import { DriverWalletService } from './driver-wallet.service';
import { TransactionInput, TransactionResponseDto } from './dto';

@ApiTags('Driver Wallet')
@Controller('driver-wallet')
export class DriverWalletController {
  constructor(private readonly driverWalletService: DriverWalletService) {}

  @ApiOperation({ summary: 'Create a new transaction' })
  @ApiObjectResponse(TransactionResponseDto)
  @Post()
  @UseGuards(DriverAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() data: TransactionInput, @CurrentUser() user: any) {
    const { amount, code } = await this.driverWalletService.create(
      user.id,
      data,
    );
    return {
      img: generateUrlQrCode({ amount, code }),
    };
  }

  @ApiOperation({ summary: 'Get wallet histories' })
  @Get()
  @UseGuards(DriverAuthGuard)
  @HttpCode(HttpStatus.OK)
  async getWalletDriver(@CurrentUser() user: any) {
    return this.driverWalletService.findByIdDriver(user.id);
  }

  @ApiOperation({ summary: 'Get transaction by code' })
  @Get(':code')
  @UseGuards(DriverAuthGuard)
  @HttpCode(HttpStatus.OK)
  async getTransactionByCode(
    @CurrentUser() user: any,
    @Param('code') code: string,
  ) {
    return this.driverWalletService.findByCodeWithDriver(code, user.id);
  }
}

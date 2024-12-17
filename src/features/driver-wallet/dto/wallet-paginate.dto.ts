import { PaginateOptions } from '@common/dto';
import { WALLET_ACTION_ENUM, WALLET_STATUS_ENUM } from '@constants';
import { IsLaterThan } from '@decorators';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsDate,
  IsEnum,
  IsNumber,
  IsOptional,
  Max,
  Min,
} from 'class-validator';

export class WalletPaginateDto extends PaginateOptions {
  @IsDate()
  @IsOptional()
  @ApiProperty({
    example: '2022-12-31T23:59:59Z',
    description: 'Start time of the delivery window',
  })
  startTime?: string;

  @IsDate()
  @IsLaterThan('startTime')
  @IsOptional()
  @ApiProperty({
    example: '2022-12-31T23:59:59Z',
    description: 'End time of the delivery window',
  })
  endTime?: string;

  @IsOptional()
  @Min(10000, {
    message: 'Minimum amount must be greater than 10.000',
  })
  @Max(500000, {
    message: 'Maximum amount must be less than 500.000',
  })
  @IsNumber()
  @ApiProperty({
    example: 10000,
    description: 'Minimum amount of the wallet',
  })
  fromAmt?: number;

  @IsOptional()
  @Min(10000, {
    message: 'Minimum amount must be greater than 10.000',
  })
  @Max(500000, {
    message: 'Maximum amount must be less than 500.000',
  })
  @IsNumber()
  @ApiProperty({
    example: 500000,
    description: 'Maximum amount of the wallet',
  })
  toAmt?: number;

  @IsOptional()
  @IsEnum(WALLET_ACTION_ENUM)
  @ApiProperty({
    enum: WALLET_ACTION_ENUM,
    description: 'Type of action of the wallet',
    example: WALLET_ACTION_ENUM.DEPOSIT,
  })
  actionType?: WALLET_ACTION_ENUM;

  @IsOptional()
  @IsEnum(WALLET_STATUS_ENUM)
  @ApiProperty({
    enum: WALLET_STATUS_ENUM,
    description: 'Status of the wallet',
    example: WALLET_STATUS_ENUM.ACCEPT,
  })
  walletStatus?: WALLET_STATUS_ENUM;
}

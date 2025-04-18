import { WALLET_ACTION_ENUM } from '@constants';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsNumber, Max, Min } from 'class-validator';

export class TransactionInput {
  @ApiProperty({
    example: 10000,
    description: 'Amount to deposit',
  })
  @IsNotEmpty()
  @IsNumber()
  @Max(500000, { message: 'Maximum amount is 500.000đ' })
  @Min(10000, { message: 'Minimum amount is 10.000đ' })
  amount: number;

  @ApiProperty({
    example: 'deposit',
    description: 'Action to perform',
    enum: WALLET_ACTION_ENUM,
  })
  @IsNotEmpty()
  @IsEnum(WALLET_ACTION_ENUM)
  action: WALLET_ACTION_ENUM;
}

export class TransactionResponseDto {
  @ApiProperty({
    example: 'https://example.com/qr-code.png',
    description: 'QR CODE image url',
  })
  img: string;
}

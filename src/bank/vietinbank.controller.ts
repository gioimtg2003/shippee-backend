import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponseProperty, ApiTags } from '@nestjs/swagger';
import { VietinbankService } from './Vietinbank.service';

@ApiTags('Vietinbank')
@Controller('vietinbank')
export class VietinbankController {
  constructor(private readonly vietinbankService: VietinbankService) {}

  @Get('transactions')
  @ApiOperation({ summary: 'Get Transactions' })
  @ApiResponseProperty({ type: String })
  transactions() {
    return this.vietinbankService.getTransaction();
  }

  @Get('enc')
  enc() {}
}

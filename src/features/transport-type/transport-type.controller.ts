import { HashAuthGuard } from '@common/guards';
import { ApiArrayResponse, ApiHashHeaders } from '@decorators';
import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { TransportTypeDTO } from './dto';
import { TransportTypeService } from './transport-type.service';

@ApiTags('transport-type')
@Controller('transport-type')
export class TransportTypeController {
  constructor(private readonly transportTypeService: TransportTypeService) {}

  @ApiOperation({ summary: 'Get all transport types' })
  @ApiHashHeaders()
  @ApiArrayResponse(TransportTypeDTO)
  @UseGuards(HashAuthGuard)
  @Get()
  @HttpCode(HttpStatus.OK)
  find() {
    return this.transportTypeService.get();
  }
}

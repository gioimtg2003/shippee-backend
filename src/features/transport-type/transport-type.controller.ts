import { ApiArrayResponse } from '@decorators';
import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { TransportTypeDTO } from './dto';
import { TransportTypeService } from './transport-type.service';

@ApiTags('transport-type')
@Controller('transport-type')
export class TransportTypeController {
  constructor(private readonly transportTypeService: TransportTypeService) {}

  @ApiOperation({ summary: 'Get all transport types' })
  @Get()
  @ApiArrayResponse(TransportTypeDTO)
  find() {
    return this.transportTypeService.get();
  }
}

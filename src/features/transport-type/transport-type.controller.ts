import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { TransportTypeService } from './transport-type.service';

@ApiTags('transport-type')
@Controller('transport-type')
export class TransportTypeController {
  constructor(private readonly transportTypeService: TransportTypeService) {}
  find() {
    return {};
  }
}

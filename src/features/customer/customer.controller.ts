import { Controller } from '@nestjs/common';
import { CustomerService } from './customer.service';

@Controller('user')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}
}

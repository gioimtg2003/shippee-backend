import { CreateCustomerInput } from '@features/customer/dto/create-customer.dto';
import { PickType } from '@nestjs/swagger';

export class CustomerRegisterInput extends PickType(CreateCustomerInput, [
  'email',
  'password',
]) {}

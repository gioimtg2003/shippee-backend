import { GoogleAIModule } from '@common/modules/google-ai.module';
import { CustomerModule } from '@features/customer';
import { Module } from '@nestjs/common';
import { AssistantCustomerController } from './assistant-customer.controller';
import { AssistantCustomerService } from './assistant-customer.service';

@Module({
  imports: [GoogleAIModule, CustomerModule],
  controllers: [AssistantCustomerController],
  providers: [AssistantCustomerService],
})
export class AssistantCustomerModule {}

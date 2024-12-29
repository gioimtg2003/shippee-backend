import { GoogleAIService } from '@common/services';
import { CustomerService } from '@features/customer/customer.service';
import { Content, FunctionCall } from '@google/generative-ai';
import { Injectable, Logger } from '@nestjs/common';
import {
  CUSTOMER_CONFIG_FUNCTION,
  systemInstructionForCustomer,
} from './function.config';

@Injectable()
export class AssistantCustomerService {
  private readonly logger = new Logger(AssistantCustomerService.name);

  constructor(
    private readonly cusService: CustomerService,
    private readonly genAiService: GoogleAIService,
  ) {}

  async testFunctionCalling(id: number, prompt: string, history: Content[]) {
    const call = await this.genAiService.getFunctionCalling(prompt, {
      functionConfig: CUSTOMER_CONFIG_FUNCTION,
      historyMessages: history,
      systemInstruction: systemInstructionForCustomer,
    });

    if (typeof call !== 'undefined') {
      if (call.length > 0) {
        await this.call(id, call);
      }
    }
    return true;
  }

  async call(id: number, funcs: FunctionCall[]) {
    const defined: Record<string, any> = {
      customer_update_name: ({ name }: { name: string }) =>
        this.cusService.update(id, {
          name: name,
        }),
    };

    for (const func of funcs) {
      if (defined[func.name]) {
        await defined[func.name](func.args);
      }
    }
  }
}

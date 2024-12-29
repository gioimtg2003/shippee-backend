import { GoogleAIService } from '@common/services';
import { CustomerService } from '@features/customer/customer.service';
import { FunctionCall } from '@google/generative-ai';
import { Injectable, Logger } from '@nestjs/common';
import { CUSTOMER_CONFIG_FUNCTION } from './function.config';

@Injectable()
export class AssistantCustomerService {
  private readonly logger = new Logger(AssistantCustomerService.name);

  constructor(
    private readonly cusService: CustomerService,
    private readonly genAiService: GoogleAIService,
  ) {}

  async testFunctionCalling(prompt: string, history: string[]) {
    const call = await this.genAiService.getFunctionCalling(
      prompt,
      CUSTOMER_CONFIG_FUNCTION,
      [...history],
    );

    if (typeof call !== 'undefined') {
      if (call.length > 0) {
        await this.call(call);
      }
    }
    return true;
  }

  async call(funcs: FunctionCall[]) {
    const defined: Record<string, any> = {
      customer_update_name: ({ id, name }: { id: number; name: string }) =>
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

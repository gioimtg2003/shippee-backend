import { GoogleAIService } from '@common/services';
import { CustomerService } from '@features/customer/customer.service';
import { Content, FunctionCall } from '@google/generative-ai';
import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import {
  CUSTOMER_CONFIG_FUNCTION,
  CUSTOMER_FUNCTION_CALLING_NAME,
  systemInstructionForCustomer,
} from './function.config';

@Injectable()
export class AssistantCustomerService {
  private readonly logger = new Logger(AssistantCustomerService.name);

  constructor(
    private readonly cusService: CustomerService,
    private readonly genAiService: GoogleAIService,
    private readonly httpService: HttpService,
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
    const defined: Record<keyof typeof CUSTOMER_FUNCTION_CALLING_NAME, any> = {
      customer_update_name: ({ name }: { name: string }) =>
        this.cusService.update(id, {
          name: name,
        }),
      calculate_price: async ({
        urlMap,
        idTransportType,
      }: {
        urlMap: string;
        idTransportType: number;
      }) => {
        await this.extraLocationByUrlMap(urlMap);
        console.log(urlMap, idTransportType);
      },
    };

    for (const func of funcs) {
      if (defined[func.name]) {
        await defined[func.name](func.args);
      }
    }
  }

  async extraLocationByUrlMap(urlMap: string) {
    const { headers } = await firstValueFrom(
      this.httpService.get(urlMap, {
        headers: {
          'Content-Type': 'application/json',
        },
        maxRedirects: 0,
        validateStatus: (status) => {
          return status >= 300 && status < 400;
        },
      }),
    );

    const extractCoordinates = (url: string) => {
      const regex = /\/dir\/([^\/]+)\/([^\/]+)\//;
      const match = url.match(regex);

      if (match && match[1] && match[2]) {
        const firstPart = match[1];
        const secondPart = match[2];

        const isCoordinate = (str) => {
          const coordinateRegex = /^-?\d+(\.\d+)?,-?\d+(\.\d+)?$/;
          return coordinateRegex.test(str);
        };

        const result = {
          first: isCoordinate(firstPart) ? 'coordinate' : 'address',
          second: isCoordinate(secondPart) ? 'coordinate' : 'address',
          firstValue: firstPart,
          secondValue: secondPart,
        };

        return result;
      } else {
        throw new Error('Không tìm thấy dữ liệu trong URL');
      }
    };

    console.log(extractCoordinates(headers['location']));
  }
}

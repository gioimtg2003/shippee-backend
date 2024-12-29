import {
  GenerateContentRequest,
  GoogleGenerativeAI,
  Part,
  Tool,
} from '@google/generative-ai';
import { Injectable } from '@nestjs/common';

@Injectable()
export class GoogleAIService {
  private readonly googleAI: GoogleGenerativeAI;
  constructor() {
    this.googleAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_KEY);
  }

  async getGenerativeModelResponse(
    request: GenerateContentRequest | string | Array<string | Part>,
    model: string = 'gemini-1.5-flash',
  ) {
    const modelAi = this.googleAI.getGenerativeModel({
      model: model,
    });

    const result = await modelAi.generateContent(request);
    const response = result.response.text().trim();
    return response;
  }

  async getFunctionCalling(
    user: string,
    functionConfig: Tool,
    historyMessages: string[],
  ) {
    const modelAi = this.googleAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      tools: [functionConfig],
      generationConfig: {
        maxOutputTokens: 1024,
      },
    });

    const prompt = ` Bạn là trợ lý của hệ thống giao hàng Shippee. Bạn ở đây để giúp đỡ khách hàng của hệ thống này.
                  Nếu khách hàng cung cấp thiếu thông tin để thực hiện yêu cầu bạn sẽ phải nhớ rằng luôn luôn hỏi khách hàng có đồng ý hoặc chắc chắn để thực hiện yêu cầu của họ hay không.
                  Nếu có chắc chắn hoặc đồng ý hãy thực hiện yêu cầu của họ, nếu không hãy thông báo cho họ biết rằng bạn không thể thực hiện yêu cầu của họ hoặc 1 câu trả lời từ chối phù hợp
                  Khách hàng:${user}
                  Lịch sử tin nhắn: ${historyMessages.join('\n')}
    `;
    const chat = modelAi.startChat();
    const result = await chat.sendMessage(prompt);
    console.log(result.response.text());

    const call = result.response.functionCalls();
    return call;
  }
}

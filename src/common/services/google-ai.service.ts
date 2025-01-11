import { GOOGLE_MODEL_NAME } from '@constants';
import {
  Content,
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
    prompt: string,
    options: {
      functionConfig: Tool;
      historyMessages: Content[];
      systemInstruction?: string;
    },
  ) {
    const { functionConfig, historyMessages, systemInstruction } = options;

    const modelAi = this.googleAI.getGenerativeModel({
      model: GOOGLE_MODEL_NAME.GEMINI_1_5_FLASH,
      tools: [functionConfig],
      generationConfig: {
        maxOutputTokens: 1024,
      },
      systemInstruction,
    });

    const chat = modelAi.startChat({
      history: [...historyMessages],
    });

    const result = await chat.sendMessage(prompt);
    console.log(result.response.text());
    console.log(result.response.usageMetadata);
    const call = result.response.functionCalls();
    console.log(call);
    return call;
  }
}

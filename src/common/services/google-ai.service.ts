import {
  GenerateContentRequest,
  GoogleGenerativeAI,
  Part,
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
}

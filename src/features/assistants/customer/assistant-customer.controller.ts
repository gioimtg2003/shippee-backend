import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AssistantCustomerService } from './assistant-customer.service';
import { TestFunctionCallingDto } from './dto';

@ApiTags('Assistant Customer')
@Controller('assistant/customer')
export class AssistantCustomerController {
  constructor(private readonly assistantCusService: AssistantCustomerService) {}

  @Post('test')
  @ApiOperation({ summary: 'Test function calling' })
  async testFunctionCalling(@Body() data: TestFunctionCallingDto) {
    return await this.assistantCusService.testFunctionCalling(
      2,
      data.prompt,
      data.history,
    );
  }
}

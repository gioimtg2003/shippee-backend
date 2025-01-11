import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayMaxSize,
  IsArray,
  IsNotEmpty,
  IsString,
  MaxLength,
} from 'class-validator';

export class ChatAIDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'Prompt to test the function calling',
    example: 'test',
  })
  prompt: string;

  @IsNotEmpty()
  @IsArray()
  @ArrayMaxSize(10)
  @ApiProperty({
    description: 'History of the prompt',
    example: [{ role: 'user', parts: [{ text: 'test' }] }],
  })
  history: HistoryDto[];
}

class HistoryDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  @ApiProperty({
    description: 'Role of the history',
    example: 'test',
  })
  role: 'user' | 'model';

  @IsNotEmpty()
  @IsArray()
  @ArrayMaxSize(10)
  @ApiProperty({
    description: 'History of the prompt',
    example: ['test'],
  })
  parts: PartDto[];
}

class PartDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  @ApiProperty({
    description: 'Content of the part',
    example: 'test',
  })
  text: string;
}

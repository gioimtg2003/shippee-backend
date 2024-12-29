import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayMaxSize,
  IsArray,
  IsNotEmpty,
  IsString,
  MaxLength,
} from 'class-validator';

export class TestFunctionCallingDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
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
    example: ['test'],
  })
  history: string[];
}

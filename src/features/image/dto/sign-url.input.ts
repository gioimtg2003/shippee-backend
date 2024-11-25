import { IsImageFileName, IsImageType } from '@decorators';
import { IsNotEmpty, IsString } from 'class-validator';

export class SignUrlInput {
  @IsNotEmpty()
  @IsString()
  @IsImageFileName()
  fileName: string;

  @IsNotEmpty()
  @IsString()
  @IsImageType()
  contentType: string;
}

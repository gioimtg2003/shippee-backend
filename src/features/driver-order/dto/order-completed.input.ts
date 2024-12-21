import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class OrderCompletedInput {
  @IsString()
  @IsNotEmpty()
  @MinLength(10)
  imgDelivered: string;
}

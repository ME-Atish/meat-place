import { IsNotEmpty, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class WalletAmountDto {
  @ApiProperty({ example: 123456 })
  @IsNotEmpty()
  @IsNumber()
  amount: number;
}

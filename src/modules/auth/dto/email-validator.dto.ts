import { IsEmail, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class EmailValidatorDto {
  @ApiProperty({ example: 'JohnDoe@gmail.com' })
  @IsNotEmpty()
  @IsEmail()
  to: string;
}

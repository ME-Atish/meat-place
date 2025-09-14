import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class VerifyEmailCodeDto {
  @ApiProperty({ example: 'JohnDoe@gmail.com' })
  @IsNotEmpty()
  @IsEmail()
  to: string;

  @ApiProperty({ example: '123456' })
  @IsNotEmpty()
  @IsString()
  @Length(4, 6)
  code: string;
}

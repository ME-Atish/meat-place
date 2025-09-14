import {
  IsBoolean,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginUserDto {
  @ApiProperty({ examples: ['JohnDoe@gmail.com', 'JohnDoe'] })
  @IsNotEmpty()
  @IsString()
  @MinLength(5)
  @MaxLength(25)
  identifier: string;

  @ApiProperty({ example: 'JohnDoe12' })
  @IsNotEmpty()
  @IsString()
  @MinLength(5)
  @MaxLength(16)
  @IsStrongPassword({
    minLength: 5,
    minLowercase: 2,
    minUppercase: 1,
    minNumbers: 1,
  })
  password: string;
}

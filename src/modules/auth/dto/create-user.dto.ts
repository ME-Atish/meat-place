import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ example: 'john_doe' })
  @IsNotEmpty()
  @IsString()
  @MinLength(5)
  @MaxLength(25)
  username: string;

  @ApiProperty({ example: 'john' })
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @MaxLength(25)
  firstName: string;

  @ApiProperty({ example: 'doe' })
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @MaxLength(25)
  lastName: string;

  @ApiProperty({ example: 'JohnDoe@gmail.com' })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ example: '733-258-1899' })
  @IsNotEmpty()
  @IsString()
  phone: string;

  @ApiProperty({ example: 'JohnDoe12' })
  @IsNotEmpty()
  @IsString()
  @IsStrongPassword({
    minLength: 5,
    minLowercase: 2,
    minUppercase: 1,
    minNumbers: 1,
  })
  password: string;
}

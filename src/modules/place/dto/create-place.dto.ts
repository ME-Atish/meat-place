import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumber,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePlaceDto {
  @ApiProperty({ example: 'place1' })
  @IsNotEmpty()
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  name: string;

  @ApiProperty({ example: 'Random address' })
  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @MaxLength(100)
  address: string;

  @ApiProperty({ example: 'Random description ' })
  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @MaxLength(100)
  description: string;

  @ApiProperty({ example: 'Random facilities' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  facilities: string;

  @ApiProperty({ example: 12346 })
  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  price: number;

  @ApiProperty({ example: 'Tehran' })
  @IsNotEmpty()
  @IsString()
  @MinLength(2)
  @MaxLength(25)
  province: string;

  @ApiProperty({ example: 'Tehran' })
  @IsNotEmpty()
  @IsString()
  @MinLength(2)
  @MaxLength(25)
  city: string;
}

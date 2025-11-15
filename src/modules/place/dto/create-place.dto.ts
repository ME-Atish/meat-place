import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsString,
  MaxLength,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

class FacilitiesDTO {
  @ApiProperty({ example: true })
  @IsBoolean()
  pool: boolean;

  @ApiProperty({ example: 2 })
  @IsNumber()
  bathrooms: number;

  @ApiProperty({ example: 3 })
  @IsNumber()
  bedrooms: number;

  @ApiProperty({ example: 140.5 })
  @IsNumber()
  totalArea: number;
}

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

  @ValidateNested()
  @Type(() => FacilitiesDTO)
  facilities: FacilitiesDTO;

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

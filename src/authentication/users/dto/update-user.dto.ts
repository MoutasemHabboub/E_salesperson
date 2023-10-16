import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsExist, Unique } from '@app/common';

export class UpdateUserDto {
  @IsNumber()
  @IsNotEmpty()
  @Min(1)
  @ApiProperty()
  @IsExist('User', 'id')
  id: number;

  @IsNotEmpty()
  @IsString()
  @MinLength(4)
  @ApiProperty()
  @Unique('User', 'name', 'id')
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsInt()
  number: number;

  @IsNumber()
  @IsNotEmpty()
  @Min(1)
  @ApiProperty()
  @IsExist('Region', 'id')
  regionId: number;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  @MinLength(1)
  @ApiPropertyOptional()
  photo: string;
}

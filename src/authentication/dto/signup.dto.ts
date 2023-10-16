import { IsExist, Unique } from '@app/common';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
export class SignupUserDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(4)
  @ApiProperty()
  @Unique('User', 'name')
  name: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @MaxLength(32)
  @ApiProperty()
  password: string;

  @IsNotEmpty()
  @IsInt()
  @ApiProperty()
  @IsExist('Region', 'id')
  regionId: number;

  @IsNotEmpty()
  @IsInt()
  @ApiProperty()
  number: number;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  photo?: string;
}

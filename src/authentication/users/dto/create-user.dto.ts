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

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  @MinLength(1)
  @ApiProperty()
  @Unique('User', 'name')
  name: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @MaxLength(32)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message:
      'password is too weak, it must contain at least one uppercase letter, one lowercase letter, one number and one special character',
  })
  @ApiProperty({ default: 'P@ssw0rd' })
  password: string;

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

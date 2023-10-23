import { IsNotEmpty, IsNumber, IsString, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IsExist } from '@app/common';

export class UpdateRegionDto {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  @IsExist('Region', 'id')
  id: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  name: string;
}

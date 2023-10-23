import { IsExist } from '@app/common';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt } from 'class-validator';

export class ValidateRegionIdDto {
  @IsInt()
  @Type(() => Number)
  @IsExist('Region', 'id')
  @ApiProperty()
  id: number;
}

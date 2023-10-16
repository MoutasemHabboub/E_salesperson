import { IsInt, IsNumber, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsExist } from '@app/common';

export class GetCommissionDto {
  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  @IsExist('User', 'id')
  salespersonId: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  month: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  year: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @IsExist('Region', 'id')
  regionId: number;
}

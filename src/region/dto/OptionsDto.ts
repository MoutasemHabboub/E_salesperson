import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional } from 'class-validator';

export class OptionsDto {
  @IsInt()
  @Type(() => Number)
  @ApiPropertyOptional()
  @IsOptional()
  skip?: number = 0;

  @IsInt()
  @Type(() => Number)
  @ApiPropertyOptional()
  @IsOptional()
  take?: number = 10;
}

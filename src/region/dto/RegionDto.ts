import { IsDateString, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegionDto {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  id: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsDateString()
  created_at: Date;

  @ApiProperty()
  @IsDateString()
  updated_at?: Date;

  count?: number;
  constructor(row: any) {
    this.id = row.id;
    this.name = row.name;

    this.created_at = new Date(row.created_at);
    if (row.updated_at) {
      this.updated_at = new Date(row.updated_at);
    }
    this.count = row._count;
  }
}

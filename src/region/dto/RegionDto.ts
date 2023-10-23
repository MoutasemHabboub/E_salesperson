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
  createdAt: Date;

  @ApiProperty()
  @IsDateString()
  updatedAt?: Date;

  count?: number;
  constructor(row: any) {
    this.id = row.id;
    this.name = row.name;

    this.createdAt = new Date(row.createdAt);
    if (row.updated_at) {
      this.updatedAt = new Date(row.updatedAt);
    }
    this.count = row._count;
  }
}

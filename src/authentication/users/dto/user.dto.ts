import {
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsString,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UserDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  @MinLength(1)
  @ApiProperty()
  userName: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsInt()
  number: number;

  @IsNumber()
  @IsNotEmpty()
  @Min(1)
  @ApiProperty()
  regionId: number;

  @IsString()
  @MaxLength(255)
  @MinLength(1)
  @ApiPropertyOptional()
  photo: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  @MinLength(1)
  @ApiProperty()
  regionName: string;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  id: number;

  @ApiProperty()
  @IsDateString()
  createdAt: Date;

  @ApiProperty()
  @IsDateString()
  updatedAt?: Date;

  constructor(row: any) {
    this.id = row.id;
    this.userName = row.userName;
    if (row.region) {
      this.regionName = row.region.name;
    }
    this.photo = row.photo;
    this.number = row.number;
    this.createdAt = new Date(row.createdAt);
    if (row.updatedAt) {
      this.updatedAt = new Date(row.updatedAt);
    }
  }
}

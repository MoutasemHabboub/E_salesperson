import { ApiProperty } from '@nestjs/swagger';
import { RegionDto } from './RegionDto';

export class RegionListDto {
  @ApiProperty()
  count: number;
  @ApiProperty({ type: [RegionDto] })
  regions: RegionDto[];
}

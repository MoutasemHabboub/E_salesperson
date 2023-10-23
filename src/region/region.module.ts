import { CommonModule } from '@app/common';
import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { RegionController } from './controllers/region.controller';
import { RegionService } from './services/region.service';

@Module({
  imports: [DatabaseModule, CommonModule],
  controllers: [RegionController],
  providers: [RegionService],
})
export class RegionModule {}

import { Module } from '@nestjs/common';
import { CommonService } from './common.service';
import { IsExistConstraint } from './validator/IsExist';
import { DatabaseModule } from '../../../src/database/database.module';
import { UniqueConstraint } from './validator/Unique';

@Module({
  imports: [DatabaseModule],
  providers: [IsExistConstraint, UniqueConstraint, CommonService],
  exports: [IsExistConstraint, UniqueConstraint, CommonService],
})
export class CommonModule {}

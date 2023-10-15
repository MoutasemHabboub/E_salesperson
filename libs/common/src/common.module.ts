import { Module } from '@nestjs/common';
import { CommonService } from './common.service';
import { IsExistConstraint } from './validator/IsExist';
import { DatabaseModule } from '../../../src/database/database.module';

@Module({
  imports: [DatabaseModule],
  providers: [IsExistConstraint, IsExistConstraint, CommonService],
  exports: [IsExistConstraint, IsExistConstraint, CommonService],
})
export class CommonModule {}

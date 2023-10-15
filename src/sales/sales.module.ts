import { Module } from '@nestjs/common';
import { SalesService } from './services/sales.service';
import { SalesController } from './services/sales.controller';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  providers: [SalesService],
  controllers: [SalesController],
  imports: [DatabaseModule],
})
export class SalesModule {}

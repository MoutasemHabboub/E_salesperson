import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthenticationModule } from './authentication/authentication.module';
import { DatabaseModule } from './database/database.module';
import { RegionModule } from './region/region.module';
import { SalesModule } from './sales/sales.module';

@Module({
  imports: [AuthenticationModule, DatabaseModule, RegionModule, SalesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

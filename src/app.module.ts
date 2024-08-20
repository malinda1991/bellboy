import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ApiModule } from './api/api.module';
import { RoutersModule } from './routers/routers.module';
import { ForexMonitorModule } from './forex-monitor/forex-monitor.module';
import { CommonModule } from '@common';

@Module({
  imports: [CommonModule, ApiModule, RoutersModule, ForexMonitorModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

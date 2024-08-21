import { Module } from '@nestjs/common';
import { ForexMonitorService } from './forex-monitor.service';
import { ForexMonitorController } from './forex-monitor.controller';

@Module({
  controllers: [ForexMonitorController],
  providers: [ForexMonitorService],
})
export class ForexMonitorModule {}

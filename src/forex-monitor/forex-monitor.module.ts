import { Module } from '@nestjs/common';
import { ForexMonitorService } from './forex-monitor.service';
import { ForexMonitorController } from './forex-monitor.controller';
import { BankScrapperFactory } from './bankScrapperFactory';
import { BocDataScrapper } from './bank-data/bocDataScrapper';

@Module({
  controllers: [ForexMonitorController],
  providers: [ForexMonitorService, BankScrapperFactory, BocDataScrapper],
  exports: [ForexMonitorService, BankScrapperFactory],
})
export class ForexMonitorModule {}

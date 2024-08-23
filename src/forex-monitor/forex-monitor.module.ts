import { Module } from '@nestjs/common';
import { ForexMonitorService } from './forex-monitor.service';
import { ForexMonitorController } from './forex-monitor.controller';
import { BankScrapperFactory } from './bankScrapperFactory';
import { BocDataScrapper } from './bank-data/bocDataScrapper';
import { MongooseModule } from '@nestjs/mongoose';
import { ForexData, ForexDataSchema } from './schema/forexData.schema';

import { DB } from './config';

@Module({
  imports: [
    MongooseModule.forFeature(
      [
        {
          name: ForexData.name,
          schema: ForexDataSchema,
        },
      ],
      DB.connectionName,
    ),
  ],
  controllers: [ForexMonitorController],
  providers: [ForexMonitorService, BankScrapperFactory, BocDataScrapper],
  exports: [ForexMonitorService, BankScrapperFactory],
})
export class ForexMonitorModule {}

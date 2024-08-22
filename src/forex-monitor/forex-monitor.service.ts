import { Injectable } from '@nestjs/common';
import { BankScrapperFactory } from './bankScrapperFactory';
import { Bank } from './types';

@Injectable()
export class ForexMonitorService {
  constructor(private readonly forexScrapperFactory: BankScrapperFactory) {}

  runScrappers = async (): Promise<void> => {
    console.log('Scrappers are starting');
    const bocScrapper = this.forexScrapperFactory.createScrapper(Bank.BOC);
    await bocScrapper.runScrapper();
  };
}

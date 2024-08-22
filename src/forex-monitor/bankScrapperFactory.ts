import { Injectable } from '@nestjs/common';
import { BocDataScrapper } from './bank-data/bocDataScrapper';
import { Bank } from './types';
import { BankScrapper } from './bank-data/bankScrapper.interface';

@Injectable()
export class BankScrapperFactory {
  constructor(private readonly boc: BocDataScrapper) {}

  createScrapper = (bank: Bank): BankScrapper => {
    switch (bank) {
      case Bank.BOC:
        return this.boc;

      default:
        throw new Error('Invalid bank name');
    }
  };
}

import { Injectable } from '@nestjs/common';
import { BocDataScrapper } from './forex-monitor/bank-data/bocDataScrapper';

@Injectable()
export class AppService {
  static runScrapper = (): void => {
    console.log('Scrapper is running');
    const bocData = new BocDataScrapper();
    bocData.runScrapper();
  };
}

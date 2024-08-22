import { Injectable } from '@nestjs/common';
import { BocDataScrapper } from './forex-monitor/bank-data/bocDataScrapper';
import { HsbcDataScrapper } from './forex-monitor/bank-data/hsbcDataScrapper';

@Injectable()
export class AppService {
  static runScrapper = async (): Promise<void> => {
    console.log('Scrapper is running');
    // const bocData = new BocDataScrapper();
    // bocData.runScrapper();
    const hsbcScrapper = new HsbcDataScrapper();
    await Promise.all([hsbcScrapper.runScrapper()]);
  };
}

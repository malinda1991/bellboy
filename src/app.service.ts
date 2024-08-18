import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  static runScrapper = (): void => {
    console.log('Scrapper is running');
  };
}

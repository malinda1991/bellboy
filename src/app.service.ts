import { Injectable } from '@nestjs/common';
import { ForexMonitorService } from './forex-monitor/forex-monitor.service';

@Injectable()
export class AppService {
  constructor(private readonly forexMonitorService: ForexMonitorService) {}

  runForexScrapper = (): void => {
    this.forexMonitorService.runScrappers();
  };
}

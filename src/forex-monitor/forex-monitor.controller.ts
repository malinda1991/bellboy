import { Controller } from '@nestjs/common';
import { ForexMonitorService } from './forex-monitor.service';

@Controller()
export class ForexMonitorController {
  constructor(private readonly forexMonitorService: ForexMonitorService) {}
}

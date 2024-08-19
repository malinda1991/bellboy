import { Test, TestingModule } from '@nestjs/testing';
import { ForexMonitorService } from './forex-monitor.service';

describe('ForexMonitorService', () => {
  let service: ForexMonitorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ForexMonitorService],
    }).compile();

    service = module.get<ForexMonitorService>(ForexMonitorService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

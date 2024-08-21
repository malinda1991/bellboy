import { Test, TestingModule } from '@nestjs/testing';
import { ForexMonitorController } from './forex-monitor.controller';
import { ForexMonitorService } from './forex-monitor.service';

describe('ForexMonitorController', () => {
  let controller: ForexMonitorController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ForexMonitorController],
      providers: [ForexMonitorService],
    }).compile();

    controller = module.get<ForexMonitorController>(ForexMonitorController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

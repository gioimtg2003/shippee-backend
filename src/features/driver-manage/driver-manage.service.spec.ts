import { Test, TestingModule } from '@nestjs/testing';
import { DriverManageService } from './driver-manage.service';

describe('DriverManageService', () => {
  let service: DriverManageService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DriverManageService],
    }).compile();

    service = module.get<DriverManageService>(DriverManageService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

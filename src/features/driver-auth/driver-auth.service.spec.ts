import { Test, TestingModule } from '@nestjs/testing';
import { DriverAuthService } from './driver-auth.service';

describe('DriverAuthService', () => {
  let service: DriverAuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DriverAuthService],
    }).compile();

    service = module.get<DriverAuthService>(DriverAuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

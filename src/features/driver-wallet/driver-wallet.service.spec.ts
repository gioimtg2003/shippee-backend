import { Test, TestingModule } from '@nestjs/testing';
import { DriverWalletService } from './driver-wallet.service';

describe('DriverWalletService', () => {
  let service: DriverWalletService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DriverWalletService],
    }).compile();

    service = module.get<DriverWalletService>(DriverWalletService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

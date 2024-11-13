import { Test, TestingModule } from '@nestjs/testing';
import { DriverWalletController } from './driver-wallet.controller';
import { DriverWalletService } from './driver-wallet.service';

describe('DriverWalletController', () => {
  let controller: DriverWalletController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DriverWalletController],
      providers: [DriverWalletService],
    }).compile();

    controller = module.get<DriverWalletController>(DriverWalletController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

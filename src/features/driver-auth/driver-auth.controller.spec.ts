import { Test, TestingModule } from '@nestjs/testing';
import { DriverAuthController } from './driver-auth.controller';
import { DriverAuthService } from './driver-auth.service';

describe('DriverAuthController', () => {
  let controller: DriverAuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DriverAuthController],
      providers: [DriverAuthService],
    }).compile();

    controller = module.get<DriverAuthController>(DriverAuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

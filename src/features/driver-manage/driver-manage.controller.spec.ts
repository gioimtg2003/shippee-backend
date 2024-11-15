import { Test, TestingModule } from '@nestjs/testing';
import { DriverManageController } from './driver-manage.controller';
import { DriverManageService } from './driver-manage.service';

describe('DriverManageController', () => {
  let controller: DriverManageController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DriverManageController],
      providers: [DriverManageService],
    }).compile();

    controller = module.get<DriverManageController>(DriverManageController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

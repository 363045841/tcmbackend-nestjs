import { Test, TestingModule } from '@nestjs/testing';
import { AimessageController } from './aimessage.controller';

describe('AimessageController', () => {
  let controller: AimessageController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AimessageController],
    }).compile();

    controller = module.get<AimessageController>(AimessageController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

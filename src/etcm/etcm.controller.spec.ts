import { Test, TestingModule } from '@nestjs/testing';
import { EtcmController } from './etcm.controller';

describe('EtcmController', () => {
  let controller: EtcmController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EtcmController],
    }).compile();

    controller = module.get<EtcmController>(EtcmController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

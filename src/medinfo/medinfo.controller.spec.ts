import { Test, TestingModule } from '@nestjs/testing';
import { MedinfoController } from './medinfo.controller';

describe('MedinfoController', () => {
  let controller: MedinfoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MedinfoController],
    }).compile();

    controller = module.get<MedinfoController>(MedinfoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

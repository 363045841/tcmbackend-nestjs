import { Test, TestingModule } from '@nestjs/testing';
import { ShowAllController } from './show-all.controller';

describe('ShowAllController', () => {
  let controller: ShowAllController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ShowAllController],
    }).compile();

    controller = module.get<ShowAllController>(ShowAllController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

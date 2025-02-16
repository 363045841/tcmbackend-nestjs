import { Test, TestingModule } from '@nestjs/testing';
import { ItemPageController } from './item-page.controller';

describe('ItemPageController', () => {
  let controller: ItemPageController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ItemPageController],
    }).compile();

    controller = module.get<ItemPageController>(ItemPageController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

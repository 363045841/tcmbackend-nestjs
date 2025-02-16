import { Test, TestingModule } from '@nestjs/testing';
import { ItemPageService } from './item-page.service';

describe('ItemPageService', () => {
  let service: ItemPageService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ItemPageService],
    }).compile();

    service = module.get<ItemPageService>(ItemPageService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

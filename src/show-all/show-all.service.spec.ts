import { Test, TestingModule } from '@nestjs/testing';
import { ShowAllService } from './show-all.service';

describe('ShowAllService', () => {
  let service: ShowAllService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ShowAllService],
    }).compile();

    service = module.get<ShowAllService>(ShowAllService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { DataMiningService } from './data-mining.service';

describe('DataMiningService', () => {
  let service: DataMiningService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DataMiningService],
    }).compile();

    service = module.get<DataMiningService>(DataMiningService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

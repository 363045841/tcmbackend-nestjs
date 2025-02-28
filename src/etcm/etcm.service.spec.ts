import { Test, TestingModule } from '@nestjs/testing';
import { EtcmService } from './etcm.service';

describe('EtcmService', () => {
  let service: EtcmService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EtcmService],
    }).compile();

    service = module.get<EtcmService>(EtcmService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

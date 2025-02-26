import { Test, TestingModule } from '@nestjs/testing';
import { AimessageService } from './aimessage.service';

describe('AimessageService', () => {
  let service: AimessageService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AimessageService],
    }).compile();

    service = module.get<AimessageService>(AimessageService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

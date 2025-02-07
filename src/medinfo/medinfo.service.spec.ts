import { Test, TestingModule } from '@nestjs/testing';
import { MedinfoService } from './medinfo.service';

describe('MedinfoService', () => {
  let service: MedinfoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MedinfoService],
    }).compile();

    service = module.get<MedinfoService>(MedinfoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

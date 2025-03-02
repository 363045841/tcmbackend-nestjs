import { Controller, Get, Param } from '@nestjs/common';
import { EtcmService } from './etcm.service';
import { DataMiningService } from './data-mining/data-mining.service';

@Controller('etcm')
export class EtcmController {
  constructor(
    private readonly etcmService: EtcmService,
    private readonly dataMiningService: DataMiningService,
  ) {}

  @Get(':name')
  async getByName(@Param('name') name: string) {
    return this.etcmService.getByName(name);
  }

  @Get('/mineCount/:name')
  async dataMine(@Param('name') name: string) {
    return this.dataMiningService.getCount(name);
  }
}

import { Controller, Get, Param } from '@nestjs/common';
import { EtcmService } from './etcm.service';
import { CountInfo, DataMiningService } from './data-mining/data-mining.service';

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

  // PREF 搜索ETCM数据的时候,可以性能优化,单字调LIKE正常查询,两个字及以上调索引MATCH
  @Get('/mineCount/:name')
  async dataMine(@Param('name') name: string) {
    let countRes: CountInfo[] = await this.dataMiningService.getCount(name);
    let medicineCount = this.dataMiningService.getMedicineCount(countRes);
    return medicineCount;
  }
}

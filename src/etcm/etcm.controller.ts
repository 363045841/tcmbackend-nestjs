import { Controller, Get, Param, Query } from '@nestjs/common';
import { EtcmService } from './etcm.service';
import {
  CountInfo,
  DataMiningService,
} from './data-mining/data-mining.service';
import { RabbitMQService } from '../rabbitmq/rabbitmq.service';

@Controller('etcm')
export class EtcmController {
  constructor(
    private readonly etcmService: EtcmService,
    private readonly dataMiningService: DataMiningService,
    private readonly rabbitMQService: RabbitMQService,
  ) {}

  @Get(':name')
  async getByName(@Param('name') name: string) {
    return this.etcmService.getByName(name);
  }

  @Get('/med/guji/:name')
  async getGuji(@Param('name') name: string) {
    return this.dataMiningService.getGuji(name);
  }

  @Get('/med/modern/:name')
  async getModern(@Param('name') name: string) {
    return this.dataMiningService.getModern(name);
  }

  // PREF 搜索ETCM数据的时候,可以性能优化,单字调LIKE正常查询,两个字及以上调索引MATCH
  @Get('/mineCount/:name')
  async dataMine(@Param('name') name: string) {
    let countRes: CountInfo[] = await this.dataMiningService.getCount(name); // 拿到组方包含name的药材表
    if (countRes.length === 0) return { count: [] };
    else {
      let medicineCount = this.dataMiningService.getMedicineCount(countRes);
      let herbNameList: string[] = medicineCount

        .map((item) => item.name)
        .filter((name) => name !== null);
      let natureCount =
        await this.dataMiningService.getNatureCount(herbNameList);
      let tasteCount = await this.dataMiningService.getTasteCount(herbNameList);
      let functionCount =
        await this.dataMiningService.getFunctionCount(herbNameList);

      let symptomsCount = await this.dataMiningService.getSymptopsCount(
        countRes.map((item) => item.recipe_name ?? ''),
      );
      return {
        count: countRes,
        natureCount: natureCount,
        tasteCount: tasteCount,
        functionCount: functionCount,
        symptomsCount: symptomsCount,
      };
    }
  }

  @Get('/mineRule/:name')
  async dataMineRule(
    @Param('name') name: string,
    @Query('confident') confident?: number, // 可选参数
    @Query('support') support?: number,
  ) {
    let rule = await this.dataMiningService.getDataMineRuleByRabbitMQ(name,confident,support);
    // let rule = await this.dataMiningService.getDataMineRule(name);
    return rule;
  }
}

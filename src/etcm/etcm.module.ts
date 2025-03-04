import { Module } from '@nestjs/common';
import { EtcmService } from './etcm.service';
import { EtcmController } from './etcm.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comprehensiveherbinfo } from './entity/etcm.entity';
import { DataMiningService } from './data-mining/data-mining.service';
import { GuJiFangJi } from './entity/gujifangji.entity';
import { ChineseMedicinalHerbs } from './entity/zhongyaocai.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Comprehensiveherbinfo,
      GuJiFangJi,
      ChineseMedicinalHerbs,
    ]),
  ],
  providers: [EtcmService, DataMiningService],
  controllers: [EtcmController],
})
export class EtcmModule {}

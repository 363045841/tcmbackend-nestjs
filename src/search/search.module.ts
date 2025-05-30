import { Get, Module } from '@nestjs/common';
import { FuzzySearchService } from './search.fuzzy.service';
import { SearchController } from './search.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IndexTable } from './IndexTable.entity';
import { medinfo } from '../medinfo/medinfo.entity';
import { Word } from './Word.entity';
import { WordIndex } from './WordIndex.entity';
import { AccurateSearchService } from './search.service';
import { GuJiFangJi } from '../etcm/entity/gujifangji.entity';
import { ChineseMedicinalHerbs } from '../etcm/entity/zhongyaocai.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      IndexTable,
      medinfo,
      Word,
      WordIndex,
      GuJiFangJi,
      ChineseMedicinalHerbs,
    ]),
  ],
  providers: [FuzzySearchService, AccurateSearchService],
  controllers: [SearchController],
})
export class SearchModule {
  constructor() {}
}

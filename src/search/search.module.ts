import { Get, Module } from '@nestjs/common';
import { SearchService } from './search.service';
import { SearchController } from './search.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IndexTable } from './IndexTable.entity';
import { medinfo } from '../medinfo/medinfo.entity';
import { Word } from './Word.entity';
import { WordIndex } from './WordIndex.entity';

@Module({
  imports: [TypeOrmModule.forFeature([IndexTable,medinfo,Word,WordIndex])],
  providers: [SearchService],
  controllers: [SearchController]
})
export class SearchModule {
  constructor() {}
}

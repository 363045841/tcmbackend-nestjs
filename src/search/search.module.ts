import { Get, Module } from '@nestjs/common';
import { SearchService } from './search.service';
import { SearchController } from './search.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IndexTable } from './IndexTable.entity';

@Module({
  imports: [TypeOrmModule.forFeature([IndexTable])],
  providers: [SearchService],
  controllers: [SearchController]
})
export class SearchModule {
  constructor() {}
}

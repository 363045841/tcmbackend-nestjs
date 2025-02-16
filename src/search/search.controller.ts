import { Controller, Get, Query } from '@nestjs/common';
import { FuzzySearchService } from './search.fuzzy.service';
import {
  type fuzzySearchClusterErrorRes,
  type fuzzySearchClusterSuccessRes,
} from './search.fuzzy.service';
import { AccurateSearchService } from './search.service';

export interface SearchFinalRes {
  id?: number;
  word: string; // 搜索词
  indexValue: number;
  title: string; // 药材名称
  description: string; // 药材描述
  picUrl: string; // 药材图片链接
  isFuzzy: boolean;
}

@Controller('search')
export class SearchController {
  constructor(
    private readonly searchService: FuzzySearchService,
    private readonly accurateSearchService: AccurateSearchService,
  ) {}

  @Get()
  async searchByWord2Vec(@Query('wd') word: string) {
    let [fuzzySearchRes, accurateSearchRes]: [
      fuzzySearchClusterSuccessRes | fuzzySearchClusterErrorRes,
      SearchFinalRes[]
    ] = await Promise.all([
      this.searchService.fuzzySearch(word),
      this.accurateSearchService.findMedinfoInAllFields(word),
    ]);
    

    if (!('error' in fuzzySearchRes)) {
      //- console.timeEnd('并发精准名称+模糊+精准全文');
      return {
        "accurate": accurateSearchRes,
        "fuzzy": fuzzySearchRes.words
      }
    } else {
      return {
        "accurate": accurateSearchRes,
        "fuzzy": []
      }
    }
  }
}

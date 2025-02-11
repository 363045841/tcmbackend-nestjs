import { Controller, Get, Query } from '@nestjs/common';
import { FuzzySearchService } from './search.fuzzy.service';
import {
  type fuzzySearchClusterErrorRes,
  type fuzzySearchClusterSuccessRes,
} from './search.fuzzy.service';
import { AccurateSearchService } from './search.service';
/* "id": 84627,
   "word": "清热",
   "indexValue": 2,
   “title”: “当归”,
   "description" : “匹配文本段落”,
   “picUrl”: "http:// ...", */
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

    
    // 并发
    console.time('并发精准名称+模糊+精准全文');
    let [fuzzySearchRes, /* accurateNameSearchRes, */ accurateSearchRes]: [
      SearchFinalRes[] | fuzzySearchClusterErrorRes,
      /* SearchFinalRes[], */
      SearchFinalRes[],
    ] = await Promise.all([
      this.searchService.fuzzySearch(word),
      /* this.accurateSearchService.findMedinfoByName(word), */
      this.accurateSearchService.findMedinfoInAllFields(word),
    ]);

    // let fuzzySearchRes:SearchFinalRes[] | fuzzySearchClusterErrorRes = await this.searchService.fuzzySearch(word);
    // let accurateSearchRes: SearchFinalRes[] = await this.accurateSearchService.findMedinfoByName(word);
    if (!('error' in fuzzySearchRes)) {
      console.timeEnd('并发精准名称+模糊+精准全文');
      return [...accurateSearchRes, ...fuzzySearchRes];
    } else {
      return [];
    }
  }
}

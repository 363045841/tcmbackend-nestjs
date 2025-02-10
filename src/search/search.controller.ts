import { Controller, Get, Query } from '@nestjs/common';
import { SearchService } from './search.service';
import {
  type fuzzySearchClusterErrorRes,
  type fuzzySearchClusterSuccessRes,
} from './search.service';
/* "id": 84627,
   "word": "清热",
   "indexValue": 2,
   “title”: “当归”,
   "description" : “匹配文本段落”,
   “picUrl”: "http:// ...", */
export interface fuzzySearchFinalRes {
  id?: number; 
  word: string; // 搜索词
  indexValue: number; 
  title: string; // 药材名称
  description: string; // 药材描述
  picUrl: string; // 药材图片链接
}

@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get()
  async searchByWord2Vec(@Query('wd') word: string) {
    let a = await this.searchService.fuzzySearch(word);
    return a;
  }
}

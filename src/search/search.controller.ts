import { Controller, Get, Query } from '@nestjs/common';
import { SearchService } from './search.service';
import { error } from 'console';

export interface fuzzySearchClusterErrorRes {
  error: string;
}
export interface fuzzySearchClusterSuccessRes {
  cluster: number;
  words: string[];
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

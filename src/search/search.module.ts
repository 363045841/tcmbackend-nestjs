import { Get, Module } from '@nestjs/common';
import { SearchService } from './search.service';
import { SearchController } from './search.controller';

@Module({
  providers: [SearchService],
  controllers: [SearchController]
})
export class SearchModule {
  constructor() {}

  @Get('/search')
  search() {
    
  }
}

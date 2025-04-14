import { Controller, Get, Query } from '@nestjs/common';
import { ShowAllService } from './show-all.service';
@Controller('show-all')
export class ShowAllController {
  constructor(private readonly ShowAllService: ShowAllService) {}

  @Get() showAll(@Query('begin') begin: number, @Query('end') end: number) {
    return this.ShowAllService.getMedinfoData(begin, end);
  }
}

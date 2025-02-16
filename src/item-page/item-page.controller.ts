import { Controller, Get, Query } from '@nestjs/common';
import { ItemPageService } from './item-page.service';

@Controller('item-page')
export class ItemPageController {
  constructor(private readonly itemPageService: ItemPageService) {}

  @Get('relation')
  async getItemRelations(@Query('id') id: number) {
    return await this.itemPageService.getRelatedTcm(id);
  }
}

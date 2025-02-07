import { Controller, Get, Param } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MedinfoService } from './medinfo.service';

@Controller('medinfo')
export class MedinfoController {
  constructor(
    private readonly configService: ConfigService,
    private readonly medinfoService: MedinfoService,
  ) {}

  @Get('page/:id')
  getPage(@Param('id') id: number) {
    return this.medinfoService.getPage(id)
  }
}

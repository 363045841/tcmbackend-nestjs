import { Controller, Get } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Controller('medinfo')
export class MedinfoController {
  constructor(private readonly configService: ConfigService) {}

  @Get('env')
  printEnv() {
    return this.configService;
  }
}

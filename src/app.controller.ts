import { Controller, Get, Param } from '@nestjs/common';
import { AppService } from './app.service';
import { ConfigService } from '@nestjs/config';

@Controller('server')
export class AppController {
  constructor(private readonly appService: AppService,
    private readonly configService: ConfigService,
  ) {}

  @Get('env')
  getEnv() {
    const internalEnv = this.configService['internalConfig']
    return internalEnv;
  }

  
}

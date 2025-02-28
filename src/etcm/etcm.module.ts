import { Module } from '@nestjs/common';
import { EtcmService } from './etcm.service';
import { EtcmController } from './etcm.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comprehensiveherbinfo } from './etcm.entity';

@Module({
  imports:[TypeOrmModule.forFeature([Comprehensiveherbinfo])],
  providers: [EtcmService],
  controllers: [EtcmController]
})
export class EtcmModule {}

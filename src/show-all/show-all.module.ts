import { Module } from '@nestjs/common';
import { ShowAllController } from './show-all.controller';
import { ShowAllService } from './show-all.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { medinfo } from '../medinfo/medinfo.entity';

@Module({
  imports: [TypeOrmModule.forFeature([
    medinfo
  ])],
  controllers: [ShowAllController],
  providers: [ShowAllService]
})
export class ShowAllModule {}

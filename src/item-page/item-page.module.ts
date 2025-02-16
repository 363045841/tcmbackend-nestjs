import { Module } from '@nestjs/common';
import { ItemPageController } from './item-page.controller';
import { ItemPageService } from './item-page.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RelatedTcm } from './relatetcm.entity';
import { medinfo } from '../medinfo/medinfo.entity';

@Module({
  imports: [TypeOrmModule.forFeature([RelatedTcm, medinfo])],
  controllers: [ItemPageController],
  providers: [ItemPageService],
})
export class ItemPageModule {}

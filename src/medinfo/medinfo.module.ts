import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { medinfo } from './medinfo.entity';
import { MedinfoController } from './medinfo.controller';
import { ConfigService } from '@nestjs/config';
import { MedinfoService } from './medinfo.service';

@Module({
    imports: [TypeOrmModule.forFeature([medinfo])],
    controllers: [MedinfoController],
    providers: [MedinfoService]
})
export class MedinfoModule {}

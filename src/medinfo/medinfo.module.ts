import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { medinfo } from './medinfo.entity';
import { MedinfoController } from './medinfo.controller';
import { ConfigService } from '@nestjs/config';

@Module({
    imports: [TypeOrmModule.forFeature([medinfo])],
    controllers: [MedinfoController]
})
export class MedinfoModule {}

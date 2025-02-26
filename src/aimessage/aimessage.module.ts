import { Module } from '@nestjs/common';
import { AimessageController } from './aimessage.controller';
import { AimessageService } from './aimessage.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Messages } from './messages.entity';
import { Conversations } from './conversations.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Messages,Conversations])],
  controllers: [AimessageController],
  providers: [AimessageService]
})
export class AimessageModule {}

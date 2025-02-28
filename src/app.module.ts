import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MedinfoModule } from './medinfo/medinfo.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as dotenv from 'dotenv';
// import * as Joi from 'joi'
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { medinfo } from './medinfo/medinfo.entity';
import { SearchModule } from './search/search.module';
import { IndexTable } from './search/IndexTable.entity';
import * as path from 'path';
import { Word } from './search/Word.entity';
import { WordIndex } from './search/WordIndex.entity';
import { ItemPageModule } from './item-page/item-page.module';
import { RelatedTcm } from './item-page/relatetcm.entity';
import { AimessageModule } from './aimessage/aimessage.module';
import { Conversations } from './aimessage/conversations.entity';
import { Messages } from './aimessage/messages.entity';
import { EtcmModule } from './etcm/etcm.module';
import { Comprehensiveherbinfo } from './etcm/etcm.entity';

@Module({
  imports: [
    MedinfoModule,
    ConfigModule.forRoot({}),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [
        () => {
          // 加载环境变量文件
          /* const config = dotenv.config({
            path: path.join(__dirname, `../.env.${process.env.NODE_ENV}`),
          }); */
          const config: any[] = [
            dotenv.config({ path: path.join(__dirname, `../.env.${process.env.NODE_ENV}`) }).parsed,
            dotenv.config({ path: path.join(__dirname, `../.env.global`) }).parsed
          ]
          const mergeConfig = Object.assign({} ,...config);
          // console.log('开始加载配置文件:', config);
          return mergeConfig || {}; // 扁平化configservice键值结构
        },
      ],
      // 可选校验
      /* validationSchema: Joi.object({
      internalConfig: Joi.object({
        app: Joi.number().required(),
      }),
    }), */
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        // console.log("config:", configService);
        // console.log('开始配置数据库连接');
        const dbConfig = {
          type: 'mysql',
          host: configService.get('TYPEORM_HOST'),
          port: configService.get('TYPEORM_PORT'),
          username: configService.get('TYPEORM_USERNAME'),
          password: configService.get('TYPEORM_PASSWORD'),
          database: configService.get('TYPEORM_DATABASE'),
          synchronize: true,
          entities: [
            medinfo,
            IndexTable,
            Word,
            WordIndex,
            RelatedTcm,
            Conversations,
            Messages,
            Comprehensiveherbinfo
          ], // 实体类数组
          logging: ['error'],
        } as TypeOrmModuleOptions;
        // console.log('数据库配置完成:', dbConfig);
        return dbConfig;
      },
    }),
    SearchModule,
    ItemPageModule,
    AimessageModule,
    EtcmModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

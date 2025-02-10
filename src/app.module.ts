import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MedinfoModule } from './medinfo/medinfo.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as dotenv from 'dotenv';
import * as Joi from 'joi'
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { medinfo } from './medinfo/medinfo.entity';
import { SearchModule } from './search/search.module';
import { IndexTable } from './search/IndexTable.entity';
import * as path from 'path';
import { Word } from './search/Word.entity';
import { WordIndex } from './search/WordIndex.entity';

@Module({
  imports: [MedinfoModule,ConfigModule.forRoot({

  }),ConfigModule.forRoot({
    isGlobal: true,
    load: [
      () => {
        // 加载环境变量文件
        const config = dotenv.config({ path: path.join(__dirname, `../.env.${process.env.NODE_ENV}`) });
        // console.log('开始加载配置文件:', config);
        return config.parsed || {}; // 扁平化configservice键值结构
      },
    ],
    // 可选校验
    /* validationSchema: Joi.object({
      internalConfig: Joi.object({
        app: Joi.number().required(),
      }),
    }), */
  }),TypeOrmModule.forRootAsync({
    imports: [ConfigModule],
    inject: [ConfigService],
    useFactory: (configService: ConfigService) => {
      // console.log("config:", configService);
      // console.log('开始配置数据库连接'); 
      const dbConfig = {
        type: "mysql", 
        host: configService.get('TYPEORM_HOST'),
        port: configService.get('TYPEORM_PORT'),
        username: configService.get('TYPEORM_USERNAME'),
        password: configService.get('TYPEORM_PASSWORD'),
        database: configService.get('TYPEORM_DATABASE'),
        synchronize: true,
        entities: [medinfo,IndexTable,Word,WordIndex], // 实体类数组
        logging: ['error'],
      } as TypeOrmModuleOptions;
      // console.log('数据库配置完成:', dbConfig);
      return dbConfig;
    },
  }), SearchModule],
  controllers: [AppController,],
  providers: [AppService],
})
export class AppModule {}

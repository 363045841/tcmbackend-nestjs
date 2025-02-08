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

@Module({
  imports: [MedinfoModule,ConfigModule.forRoot({

  }),ConfigModule.forRoot({
    isGlobal: true,
    load: [
      () => {
        // 加载开发环境配置文件.env.development
        const config = dotenv.config({ path: 'D:\\Code\\tcmbackend\\tcmbackend\\.env.production' });
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
        type: configService.get('TYPEORM_TYPE'), 
        host: configService.get('TYPEORM_HOST'),
        port: configService.get('TYPEORM_PORT'),
        username: configService.get('TYPEORM_USERNAME'),
        password: configService.get('TYPEORM_PASSWORD'),
        database: configService.get('TYPEORM_DATABASE'),
        synchronize: true,
        entities: [medinfo,IndexTable], // 实体类数组
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

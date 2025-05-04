import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserModule } from 'src/user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from 'src/user/user.entity';

@Module({
  imports: [
    UserModule,
    JwtModule.register({
      secret: 'gjsda0opjgeo', // 推荐从 .env 中读取
      signOptions: { expiresIn: '1h' },
    }),
    TypeOrmModule.forFeature([Users])
  ],
  controllers: [AuthController],
  providers: [AuthService]
})
export class AuthModule {}

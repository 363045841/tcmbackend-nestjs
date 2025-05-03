import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcryptjs';
import { FastifyRequest, FastifyReply } from 'fastify'; // 可选类型支持
import { Inject } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';

@Injectable()
export class AuthService {
  constructor(private usersService: UserService) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findOneByUsername(username);
    if (user && (await bcrypt.compare(pass, user.password))) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any, request: FastifyRequest, reply: FastifyReply) {
    const payload = { username: user.username, sub: user.id };

    // 使用 Fastify 的 jwt 实例签发 Token
    const token = await reply.jwtSign(payload);

    return {
      access_token: token,
    };
  }
}
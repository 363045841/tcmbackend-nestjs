import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcryptjs';
import { FastifyRequest, FastifyReply } from 'fastify'; // 可选类型支持
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from 'src/user/user.entity';
import { Repository } from 'typeorm';
// import { Inject } from '@nestjs/common';
// import { APP_GUARD } from '@nestjs/core';

@Injectable()
export class AuthService {
  constructor(private usersService: UserService,
    @InjectRepository(Users) private usersRepository: Repository<Users>
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findOneByUsername(username);
    if (user && (await bcrypt.compare(pass, user.password))) {
      const { password, ...result } = user;
      console.log("validate success");
      return result;
    }
    return null;
  }

  async login(user: any, request: FastifyRequest, reply: FastifyReply) {
    const payload = { username: user.username, sub: user.id };

    // 使用 Fastify 的 jwt 实例签发 Token
    const token = await reply.jwtSign(payload);
    console.log("JWT token:", token);
    return { 
      access_token: token,
    };
  }

  async getUserById(id: number): Promise<Users | null> {
    const profile = await this.usersRepository.findOne({ where: { id } });
    return profile;
  }
}
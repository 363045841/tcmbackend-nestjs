import { Injectable } from '@nestjs/common';
import { Redis } from 'ioredis';

@Injectable()
export class RedisService {
  private redis: Redis;

  constructor() {
    this.redis = new Redis({
      host: '127.0.0.1', // Redis 服务器地址
      port: 6379,        // Redis 端口
      password: process.env.REDIS_PASSPORT, // Redis 密码（如果有）
      // 其他配置项
    });
  }

  // 获取 Redis 客户端实例
  getClient(): Redis {
    return this.redis;
  }

  // 设置键值对
  async set(key: string, value: any, ttl: number = 3600): Promise<'OK'> {
    return this.redis.set(key, JSON.stringify(value), 'EX', ttl);
  }

  // 获取键值对
  async get<T>(key: string): Promise<T | null> {
    const result = await this.redis.get(key);
    return result ? JSON.parse(result) : null;
  }

  // 其他操作方法...
}

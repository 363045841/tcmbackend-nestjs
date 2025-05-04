import { Injectable } from '@nestjs/common';
import * as OSS from 'ali-oss';
import { RedisService } from '../redis/redis.service';

@Injectable()
export class OssService {
  private client: OSS;

  constructor(private readonly redisService: RedisService) {
    this.client = new OSS({
      region: process.env.OSS_KEY_REGION, // 替换为你的 OSS 区域
      accessKeyId: process.env.OSS_KEY_ID, // 替换为你的 AccessKeyId
      accessKeySecret: process.env.OSS_KEY_SECRET, // 'DjgDcAl3OmeK3N0YgHPXnLQWrmz28Q', // 替换为你的 AccessKeySecret
      bucket: process.env.OSS_KEY_BUCKET, // 替换为你的 Bucket 名称
      secure: true, // 使用 HTTPS
    });
  }

  /**
   * 获取 OSS 文件的签名 URL
   * @param filePath 文件路径，例如 'zyysjk/example.jpg'
   * @returns 签名 URL
   */
  async getSignedUrl(filePath: string): Promise<string> {
    const result = await this.client.signatureUrl(filePath, {
      expires: 3600, // 签名 URL 的有效期（秒）
    });
    return result;
  }

  /**
   * 获取图片并缓存到 Redis
   * @param filePath 文件路径
   * @returns 图片的二进制数据
   */
  async getImage(filePath: string): Promise<Buffer | null> {
    // 首先尝试从 Redis 中获取缓存
    const cachedImage = await this.redisService.get<{
      type: string;
      data: number[];
    }>(filePath);

    if (cachedImage) {
      // 将缓存的图片数据从 { type: 'Buffer', data: [...] } 转换为 Buffer
      console.log('获取缓存的图片数据...');
      const imageBuffer = Buffer.from(cachedImage.data);
      return imageBuffer; // 返回图片的二进制数据
    }
    console.log('从 OSS 获取图片数据...');
    // 如果没有缓存，从 OSS 获取图片

    try {
      const result = await this.client.get(filePath);
      const imageBuffer = result.content; // 图片的二进制数据
      // 将图片缓存到 Redis，缓存 1 小时
      await this.redisService.set(
        filePath,
        { type: 'Buffer', data: Array.from(imageBuffer) },
        3600,
      );

      return imageBuffer;
    } catch (error) {
      console.error('从 OSS 获取图片失败:', error);
      return null;
    }
  }
}

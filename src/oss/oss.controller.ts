// oss.controller.ts
import {
  Controller,
  Get,
  Header,
  HttpException,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { OssService } from './oss.service';

@Controller('oss')
export class OssController {
  constructor(private readonly ossService: OssService) {}

  /**
   * 获取图片的签名 URL
   * @param filePath 图片路径，例如 'zyysjk/example.jpg'
   * @returns 签名 URL
   */
  @Get('get-signed-url')
  async getSignedUrl(@Query('filePath') filePath: string): Promise<string> {
    return this.ossService.getSignedUrl(filePath);
  }

  /**
   * 直接返回图片数据
   * @param filePath 图片路径，例如 'zyysjk/example.jpg'
   * @returns 图片二进制流
   */
  @Get('get-image')
  @Header('Content-Type', 'image/jpeg') // 使用 @Header 装饰器设置响应头
  async getImage(@Query('filePath') filePath: string): Promise<Buffer> {
    try {
      return await this.ossService.getImage(filePath); // 返回图片的二进制数据
    } catch (error) {
      throw new HttpException(
        'Failed to fetch image',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}

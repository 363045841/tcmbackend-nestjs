import {
  Controller,
  Get,
  Header,
  HttpException,
  HttpStatus,
  Query,
  Res,
} from '@nestjs/common';
import { FastifyReply } from 'fastify'; // 导入 Fastify 的 FastifyReply 类型
import { OssService } from './oss.service';

@Controller('oss')
export class OssController {
  constructor(private readonly ossService: OssService) {}

  /**
   * 直接返回图片数据
   * @param filePath 图片路径，例如 'zyysjk/example.jpg'
   * @returns 图片二进制流
   */
  @Get('get-image')
  async getImage(
    @Query('filePath') filePath: string,
    @Res() res: FastifyReply,
  ): Promise<void> {
    try {
      const imageBuffer = await this.ossService.getImage(filePath); // 获取图片的二进制数据
      if (imageBuffer === null) {
        res.status(404).send('Image not found'); // 如果图片不存在，返回404错误信息
      }

      // 设置响应头为图片类型
      res.type('image/jpeg'); // 确保设置为 image/jpeg

      // 返回图片的二进制数据
      res.send(imageBuffer); // 将缓存或从 OSS 获取的图片返回
    } catch (error) {
      throw new HttpException(
        'Failed to fetch image',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}

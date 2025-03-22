import { Injectable, Logger, NestMiddleware } from '@nestjs/common';

@Injectable()
export class LoggingMiddleware implements NestMiddleware {
  use(req: any, res: any, next: () => void) {
    const time = Date.now();
    Logger.log(`APP Builder API 调用: ${req.url}`, 'HTTP');
    next();
  }
}

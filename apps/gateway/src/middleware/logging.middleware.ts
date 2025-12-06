import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggingMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const start = Date.now();

    res.on('finish', () => {
      const time = Date.now() - start;
      console.log(`${req.method} ${req.originalUrl} - ${time}ms`);
    });

    next();
  }
}

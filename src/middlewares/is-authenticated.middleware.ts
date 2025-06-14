import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { log } from 'console';
import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class IsAuthenticatedMiddleware implements NestMiddleware {
  constructor(private readonly ConfigService: ConfigService) {}

  use(req: Request, res: Response, next: NextFunction) {
    const bearedToken = req.headers['authorization'];

    if (!bearedToken) {
      throw new UnauthorizedException();
    }

    const [_bearer, token] = bearedToken.split(' ');

    if (!token) {
      throw new UnauthorizedException();
    }
    try {
      const payload = jwt.verify(
        token,
        this.ConfigService.getOrThrow<string>('JWT_SECRET'),
      );

      req['user'] = payload;
    } catch (error) {
      throw new UnauthorizedException();
    }

    //console.log(payload);

    next();
  }
}

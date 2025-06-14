import { NestMiddleware } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request, Response, NextFunction } from 'express';
export declare class IsAuthenticatedMiddleware implements NestMiddleware {
    private readonly ConfigService;
    constructor(ConfigService: ConfigService);
    use(req: Request, res: Response, next: NextFunction): void;
}

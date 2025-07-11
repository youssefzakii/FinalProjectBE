import {
    Injectable,
    NestMiddleware,
    UnauthorizedException,
    ForbiddenException,
  } from "@nestjs/common";
  import { Request, Response, NextFunction } from "express";
  
  @Injectable()
  export class IsAdminMiddleware implements NestMiddleware {
    use(req: Request, res: Response, next: NextFunction) {
      const user = req["user"];
      
      if (!user) {
        throw new UnauthorizedException("User not authenticated");
      }
  
      if (user.role !== "admin") {
        throw new ForbiddenException("Access denied. Admin role required");
      }
  
      next();
    }
  }
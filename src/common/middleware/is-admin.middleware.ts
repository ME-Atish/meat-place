import {
  ForbiddenException,
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

import { AuthRole } from 'src/modules/auth/enums/auth-role.enum';
import { UserService } from 'src/modules/user/user.service';

@Injectable()
export class IsAdminMiddleware implements NestMiddleware {
  constructor(private readonly userService: UserService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
      throw new UnauthorizedException('No authorization header provided');
    }
    // Extract token from request
    const token = authHeader.split(' ')[1];
    if (!token) {
      throw new UnauthorizedException('Access token missing');
    }

    let payload: any;
    try {
      payload = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!);
    } catch (err) {
      throw new UnauthorizedException('Invalid access token');
    }

    // Store payload at req.user
    req['user'] = payload;

    const user = await this.userService.getOne(payload.sub);
    if (!user) throw new UnauthorizedException('User not found');

    if (user.role === AuthRole.USER) {
      throw new ForbiddenException('You do not have access to this route');
    }

    next();
  }
}

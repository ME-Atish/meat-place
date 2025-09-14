import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';

import { User } from '../../modules/auth/user.entity';

@Injectable()
export class AccessTokenGuard extends AuthGuard('jwt-access') {
  async canActivate(context: ExecutionContext) {
    // Get client/user request
    const request = context.switchToHttp().getRequest<Request>();

    await super.canActivate(context);

    // Set request that user send to req and store user properties in it
    const req = request as Request & { user: User };
    const user = req.user;

    if (!user) throw new UnauthorizedException('User not found');

    if (user.isBan) throw new UnauthorizedException('User is ban');

    return true;
  }
}

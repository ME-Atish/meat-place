import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { User } from '../../modules/auth/user.entity';

@Injectable()
export class RefreshTokenGuard extends AuthGuard('jwt-refresh') {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {
    super();
  }

  async canActivate(context: ExecutionContext) {
    // Get user request
    const request = context.switchToHttp().getRequest<Request>();
    // Get token (refresh token) that client/user sent in request
    const token = this.extractToken(request);

    await super.canActivate(context);

    // Set request that user send to req and store user properties in it
    const req = request as Request & { user: User };
    const user = req.user;

    if (!user.refreshToken) return false;

    // Check is token (refresh token) valid or not
    const isValid = await bcrypt.compare(token, user.refreshToken);
    if (!isValid) throw new UnauthorizedException('Refresh token mismatch');

    return true;
  }

  // Extract token from request
  private extractToken(request: Request): string {
    const authHeader = request.headers['authorization'];
    return authHeader?.split(' ')[1] ?? '';
  }
}

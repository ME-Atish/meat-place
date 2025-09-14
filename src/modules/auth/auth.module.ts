import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { User } from './user.entity';
import { AccessTokenStrategy } from './strategies/jwt-access-token.strategy';
import { RefreshTokenStrategy } from './strategies/jwt-refresh-token.strategy';
import { Wallet } from 'src/modules/wallet/wallet.entity';
import { TokenModule } from 'src/modules/tokens/token.module';
import { AccessTokenGuard } from '../../common/guards/access-token.guard';
import { GenerateRandomCode } from '../../common/utils/generate-random-code';
import { GoogleStrategy } from './strategies/google.strategy';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt-access' }),
    PassportModule.register({ defaultStrategy: 'google' }),
    JwtModule.register({}),
    TokenModule,
    TypeOrmModule.forFeature([User, Wallet]),
  ],
  providers: [
    AuthService,
    AccessTokenStrategy,
    RefreshTokenStrategy,
    AccessTokenGuard,
    GenerateRandomCode,
    GoogleStrategy,
  ],
  controllers: [AuthController],
  exports: [],
})
export class AuthModule {}

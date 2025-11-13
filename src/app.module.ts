import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';
import { MailerModule } from '@nestjs-modules/mailer';

import { AppDataSource } from './database/data-source';
import { AuthModule } from './modules/auth/auth.module';
import { WalletModule } from './modules/wallet/wallet.module';
import { PlaceModule } from './modules/place/place.module';
import { ReserveModule } from './modules/reserve/reserve.module';
import { UserModule } from './modules/user/user.module';
import { IsOwnerMiddleware } from './common/middleware/is-owner.middleware';
import { PlaceController } from './modules/place/place.controller';
import { IsAdminMiddleware } from './common/middleware/is-admin.middleware';
import { UserController } from './modules/user/user.controller';
import { RedisModule } from './modules/redis/redis.module';

dotenv.config();

@Module({
  imports: [
    TypeOrmModule.forRoot(AppDataSource.options),

    MailerModule.forRoot({
      transport: {
        service: 'gmail',
        host: `${process.env.EMAIL_HOST}`,
        auth: {
          user: `${process.env.EMAIL}`,
          pass: `${process.env.EMAIL_PASSWORD}`,
        },
      },
    }),

    AuthModule,
    PlaceModule,
    WalletModule,
    ReserveModule,
    UserModule,
    RedisModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(IsOwnerMiddleware)
      .exclude(
        { path: `v${process.env.VERSION}/`, method: RequestMethod.GET },
        { path: `v${process.env.VERSION}/:id`, method: RequestMethod.GET },
        { path: `v${process.env.VERSION}/`, method: RequestMethod.POST },
      )
      .forRoutes(PlaceController);

    consumer
      .apply(IsAdminMiddleware)
      .exclude({ path: '/:id', method: RequestMethod.PUT })
      .forRoutes(UserController);
  }
}

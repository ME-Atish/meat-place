import { Global, Module } from '@nestjs/common';
import Redis from 'ioredis';

@Global()
@Module({
  providers: [
    {
      provide: 'REDIS_CLIENT',
      useFactory: () => {
        // Use REDIS_URL if provided (cloud Redis), otherwise fallback to localhost
        const redisUrl = process.env.REDIS_URL;
        if (redisUrl) {
          return new Redis(redisUrl);
        }

        // fallback to local Redis
        return new Redis({
          host: process.env.REDIS_HOST || '127.0.0.1',
          port: Number(process.env.REDIS_PORT) || 6379,
        });
      },
    },
  ],
  exports: ['REDIS_CLIENT'],
})
export class RedisModule {}

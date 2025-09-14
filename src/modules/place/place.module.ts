import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

import { User } from 'src/modules/auth/user.entity';
import { Place } from './place.entity';
import { PlaceService } from './place.service';
import { PlaceController } from './place.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Place, User]),

    MulterModule.register({
      storage: diskStorage({
        destination: '../uploads',
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, uniqueSuffix + extname(file.originalname));
        },
      }),
    }),
  ],
  providers: [PlaceService],
  controllers: [PlaceController],
})
export class PlaceModule {}

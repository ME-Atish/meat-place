import { DataSource } from 'typeorm';
import { User } from '../modules/auth/user.entity';
import { Place } from '../modules/place/place.entity';
import { Wallet } from '../modules/wallet/wallet.entity';
import { Reserve } from '../modules/reserve/reserve.entity';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'place',
  entities: [User, Place, Wallet, Reserve],
  synchronize: true,
});

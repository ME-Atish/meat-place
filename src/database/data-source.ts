import { DataSource } from 'typeorm';
import { User } from '../modules/auth/user.entity';
import { Place } from '../modules/place/place.entity';
import { Wallet } from '../modules/wallet/wallet.entity';
import { Reserve } from '../modules/reserve/reserve.entity';

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL, // Neon connection string
  ssl: { rejectUnauthorized: false }, // Neon requires SSL
  entities: [User, Place, Wallet, Reserve],
  synchronize: false, // Keep false in production, use migrations instead
});

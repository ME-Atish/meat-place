import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { AuthRole } from './enums/auth-role.enum';
import { AuthProvider } from './enums/auth-provider.enum';
import { Place } from 'src/modules/place/place.entity';
import { Wallet } from 'src/modules/wallet/wallet.entity';
import { Reserve } from 'src/modules/reserve/reserve.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  username: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ select: false, nullable: true })
  password: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ unique: true })
  email: string;

  @Column({ default: 'USER' })
  role: AuthRole;

  @Column({ default: false })
  isReserved: boolean;

  @Column({ default: false })
  isOwner: boolean;

  @Column({ default: false })
  isBan: boolean;

  @Column({ nullable: true })
  refreshToken: string;

  @Column({ default: 'local' })
  provider: AuthProvider;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Place, (place) => place.owner, {
    eager: true,
    cascade: true,
  })
  places: Place[];

  @OneToMany(() => Reserve, (reserve) => reserve.user)
  reserves: Reserve[];

  @OneToOne(() => Wallet, (wallet) => wallet.user, { cascade: true })
  wallet: Wallet;
}

import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { User } from 'src/modules/auth/user.entity';
import { Reserve } from 'src/modules/reserve/reserve.entity';

@Entity()
export class Place {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  address: string;

  @Column()
  description: string;

  @Column()
  facilities: string;

  @Column({ unsigned: true })
  price: number;

  @Column({ default: false })
  isReserved: boolean;

  @Column()
  province: string;

  @Column()
  city: string;

  @Column({ nullable: true })
  image: string;

  @OneToMany(() => Reserve, (reserve) => reserve.place)
  reserves: Reserve[];

  @ManyToOne(() => User, (user) => user.places, { eager: false })
  owner: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

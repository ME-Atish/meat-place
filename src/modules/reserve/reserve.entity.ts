import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { User } from '../auth/user.entity';
import { Place } from '../place/place.entity';

@Entity()
export class Reserve {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'timestamp without time zone' })
  startDate: Date;

  @Column({ type: 'timestamp without time zone' })
  finishDate: Date;

  @ManyToOne(() => Place, (place) => place.reserves, {
    eager: true,
    cascade: true,
  })
  place: Place;

  @ManyToOne(() => User, (user) => user.reserves, {
    eager: true,
    cascade: true,
  })
  user: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

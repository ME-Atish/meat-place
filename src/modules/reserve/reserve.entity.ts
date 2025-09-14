import {
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { User } from 'src/modules/auth/user.entity';
import { Place } from 'src/modules/place/place.entity';

@Entity()
export class Reserve {
  @PrimaryGeneratedColumn('uuid')
  id: string;

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

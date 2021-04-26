import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { User } from './user.entity';

@Entity()
@Unique(['token'])
export class FcmToken {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar')
  token: string;

  @Column('boolean')
  isLogIn: boolean;

  @ManyToMany(() => User, (user) => user.fcmTokens)
  @JoinTable()
  users: User[];
}

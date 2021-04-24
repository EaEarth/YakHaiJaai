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

  @ManyToMany(() => User, (user) => user.fcmTokens)
  @JoinTable()
  users: User[];
}

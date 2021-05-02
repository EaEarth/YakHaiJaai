import { Bill } from 'entities/bills/bill.entity';
import { User } from 'entities/users/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class BillNotification {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar')
  title: string;

  @Column('varchar')
  description: string;

  @Column('date')
  payDate: Date;

  @Column('boolean')
  isReaded: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Bill, (bill) => bill.notifications)
  bill: Bill;

  @ManyToOne(() => User, (user) => user.notifications)
  user: User;
}

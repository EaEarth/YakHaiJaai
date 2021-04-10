import { Bill } from 'entities/bills/bill.entity';
import { User } from 'entities/users/user.entity';
import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class FileItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  type: string;

  @Column()
  path: string;

  @OneToOne(() => User, (user) => user.avatarPict)
  avatarUser: User;

  @OneToOne(() => Bill, (bill) => bill.qrCode)
  qrBill: Bill;
}

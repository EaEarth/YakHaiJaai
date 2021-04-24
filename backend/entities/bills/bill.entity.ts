import { FileItem } from 'entities/files/fileItem.entity';
import { Item } from 'entities/items/item.entity';
import { BillNotification } from 'entities/notifications/notification.entity';
import { User } from 'entities/users/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Bill {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToOne(() => FileItem, (file) => file.qrBill)
  @JoinColumn()
  qrCode: FileItem;

  @OneToMany(() => Item, (item) => item.bill)
  items: Item[];

  @OneToMany(() => BillNotification, (noti) => noti.bill)
  notifications: BillNotification[];

  @ManyToMany(() => User, (user) => user.bills)
  @JoinTable()
  participants: User[];
}

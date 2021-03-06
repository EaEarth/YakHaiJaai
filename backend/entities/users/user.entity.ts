import { Bill } from 'entities/bills/bill.entity';
import { FileItem } from 'entities/files/fileItem.entity';
import { Item } from 'entities/items/item.entity';
import { BillNotification } from 'entities/notifications/notification.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToMany,
  OneToMany,
  OneToOne,
  PrimaryColumn,
  Unique,
  JoinTable,
  UpdateDateColumn,
} from 'typeorm';
import { FcmToken } from './fcmToken.entity';

@Entity()
@Unique(['username'])
@Unique(['uid'])
export class User {
  @PrimaryColumn('varchar')
  uid: string;

  @Column()
  username: string;

  @Column()
  firstname: string;

  @Column()
  lastname: string;

  @Column()
  phoneNumber: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToOne(() => FileItem, (file) => file.avatarUser)
  @JoinColumn()
  avatarPict: FileItem;

  @ManyToMany(() => Item, (item) => item.payers)
  items: Item[];

  @ManyToMany(() => Bill, (bill) => bill.participants)
  bills: Bill[];

  @ManyToMany(() => FcmToken, (token) => token.users)
  fcmTokens: FcmToken[];

  @OneToMany(() => BillNotification, (token) => token.user)
  notifications: BillNotification[];

  @OneToMany(() => Bill, (bill) => bill.owner)
  owns: Bill[];
}

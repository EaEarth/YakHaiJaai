import { Bill } from 'entities/bills/bill.entity';
import { FileItem } from 'entities/files/fileItem.entity';
import { Item } from 'entities/items/item.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  OneToOne,
  PrimaryColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
@Unique(['username'])
@Unique(['uid'])
export class User {
  @PrimaryColumn()
  uid: number;

  @Column()
  username: string;

  @Column()
  prefix: string;

  @Column()
  firstname: string;

  @Column()
  lastname: string;

  @Column('date')
  birthDate: Date;

  @Column()
  phoneNumber: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToOne(() => FileItem, (file) => file.avatarUser)
  avatarPict: FileItem;

  @ManyToMany(() => Item, (item) => item.payers)
  items: Item[];

  @ManyToMany(() => Bill, (bill) => bill.participants)
  bills: Bill[];
}

import { FileItem } from 'entities/files/fileItem.entity';
import { Item } from 'entities/items/item.entity';
import { User } from 'entities/users/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
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
  qrCode: FileItem;

  @OneToMany(() => Item, (item) => item.bill)
  items: Item[];

  @ManyToMany(() => User, (user) => user.bills)
  @JoinTable()
  participants: User[];
}

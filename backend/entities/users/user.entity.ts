import { FileItem } from 'entities/files/fileItem.entity';
import {
  Column,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';

@Entity()
@Unique(['username'])
export class User {
  @PrimaryGeneratedColumn()
  id: number;

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
  telNumber: string;

  @OneToOne(() => FileItem, (file) => file.avatarUser)
  avatarPict: FileItem;
}

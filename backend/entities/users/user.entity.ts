import { FileItem } from 'entities/files/fileItem.entity';
import { Column, Entity, OneToOne, PrimaryColumn, Unique } from 'typeorm';

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

  @OneToOne(() => FileItem, (file) => file.avatarUser)
  avatarPict: FileItem;
}

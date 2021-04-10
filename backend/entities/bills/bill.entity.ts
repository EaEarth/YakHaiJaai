import { FileItem } from 'entities/files/fileItem.entity';
import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Bill {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToOne(() => FileItem, (file) => file.qrBill)
  qrCode: FileItem;
}

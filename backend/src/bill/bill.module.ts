import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Bill } from 'entities/bills/bill.entity';
import { Item } from 'entities/items/item.entity';
import { FileItemModule } from 'src/file-item/file-item.module';
import { UserModule } from 'src/user/user.module';
import { BillController } from './bill.controller';
import { BillService } from './bill.service';

@Module({
  imports: [TypeOrmModule.forFeature([Bill, Item]), UserModule, FileItemModule],
  controllers: [BillController],
  providers: [BillService],
})
export class BillModule {}

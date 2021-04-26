import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BillNotification } from 'entities/notifications/notification.entity';
import { User } from 'entities/users/user.entity';
import { BillModule } from 'src/bill/bill.module';
import { UserModule } from 'src/user/user.module';
import { NotificationController } from './notification.controller';
import { NotificationService } from './notification.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([BillNotification, User]),
    UserModule,
    BillModule,
  ],
  controllers: [NotificationController],
  providers: [NotificationService],
})
export class NotificationModule {}

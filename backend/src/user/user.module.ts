import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FcmToken } from 'entities/users/fcmToken.entity';
import { User } from 'entities/users/user.entity';
import { AppModule } from 'src/app.module';
import { FileItemModule } from 'src/file-item/file-item.module';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, FcmToken]),
    forwardRef(() => AppModule),
    FileItemModule,
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}

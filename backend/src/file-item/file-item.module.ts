import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FileItem } from 'entities/files/fileItem.entity';
import { UserModule } from 'src/user/user.module';
import { FileItemController } from './file-item.controller';
import { MulterImport } from './file-item.imports';
import { FileItemService } from './file-item.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([FileItem]),
    MulterImport,
    forwardRef(() => UserModule),
  ],
  controllers: [FileItemController],
  providers: [FileItemService],
  exports: [FileItemService],
})
export class FileItemModule {}

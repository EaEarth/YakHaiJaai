import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FileItem } from 'entities/files/fileItem.entity';
import { FileItemController } from './file-item.controller';
import { FileItemService } from './file-item.service';

@Module({
  imports: [TypeOrmModule.forFeature([FileItem])],
  controllers: [FileItemController],
  providers: [FileItemService],
  exports: [FileItemService],
})
export class FileItemModule {}

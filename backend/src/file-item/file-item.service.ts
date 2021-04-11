import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FileItem } from 'entities/files/fileItem.entity';
import { Repository } from 'typeorm';

@Injectable()
export class FileItemService {
  constructor(
    @InjectRepository(FileItem) private readonly repo: Repository<FileItem>,
  ) {}

  async findById(id: number): Promise<FileItem> {
    return this.repo.findOne(id);
  }
}

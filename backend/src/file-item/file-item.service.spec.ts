import { Test, TestingModule } from '@nestjs/testing';
import { FileItemService } from './file-item.service';

describe('FileItemService', () => {
  let service: FileItemService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FileItemService],
    }).compile();

    service = module.get<FileItemService>(FileItemService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

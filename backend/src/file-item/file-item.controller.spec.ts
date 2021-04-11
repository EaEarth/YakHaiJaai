import { Test, TestingModule } from '@nestjs/testing';
import { FileItemController } from './file-item.controller';

describe('FileItemController', () => {
  let controller: FileItemController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FileItemController],
    }).compile();

    controller = module.get<FileItemController>(FileItemController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

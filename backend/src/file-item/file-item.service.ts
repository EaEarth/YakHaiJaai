import {
  forwardRef,
  Inject,
  Injectable,
  Req,
  Res,
  UploadedFile,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FileItem } from 'entities/files/fileItem.entity';
import { User } from 'entities/users/user.entity';
import { UserService } from 'src/user/user.service';
import { Repository } from 'typeorm';
import { createFile } from './dto/create-file.dto';

@Injectable()
export class FileItemService {
  constructor(
    @InjectRepository(FileItem) private readonly repo: Repository<FileItem>,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
  ) {}

  index(): Promise<FileItem[] | undefined> {
    return this.repo.find();
  }

  async findById(id: number): Promise<FileItem | undefined> {
    return this.repo.findOne(id);
  }

  async findByTitle(title: string): Promise<FileItem[] | undefined> {
    return this.repo.find({ title: title });
  }

  async createFile(
    @Req() req,
    dto: createFile,
    @UploadedFile() file,
  ): Promise<FileItem> {
    const user = await this.userService.getUserInfoByToken(
      req.headers.authtoken,
    );
    const newFile = new FileItem();

    newFile.title = dto.title ? dto.title : file.originalname;
    newFile.type = file.mimetype;
    newFile.path = `${req.protocol}://${req.headers.host}/api/files/${file.filename}`;
    newFile.avatarUser = user;

    return this.repo.save(newFile);
  }

  serveStatic(file: string, @Res() res) {
    res.sendFile(file, { root: 'uploads' }, (err: any) => {
      if (err) {
        res
          .status(404)
          .json({
            status: 404,
            error: 'Bad Request',
            message: "Image isn't found",
          })
          .end();
      }
    });
  }
}

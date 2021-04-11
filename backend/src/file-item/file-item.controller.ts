import {
  Controller,
  Get,
  Param,
  Post,
  Req,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  Request,
  Body,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UserService } from 'src/user/user.service';
import { createFile } from './dto/create-file.dto';
import { FileItemService } from './file-item.service';

@Controller('file-item')
export class FileItemController {
  constructor(
    private readonly fileService: FileItemService,
    private readonly userService: UserService,
  ) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(@UploadedFile() file, @Body() dto: createFile, @Request() req) {
    return this.fileService.createFile(req, dto, file);
  }

  @Get('index')
  async index(@Request() req) {
    this.userService.getUserInfoByToken(req.headers.authtoken);
    return this.fileService.index(req.user);
  }

  @Get('id/:fileId')
  async findById(@Request() req, @Param('fileId') fileId: number) {
    this.userService.getUserInfoByToken(req.headers.authtoken);
    return this.fileService.findById(fileId);
  }

  @Get(':fileName')
  async serveFile(
    @Request() req,
    @Param('fileName') fileName: string,
    @Res() res,
  ) {
    this.userService.getUserInfoByToken(req.headers.authtoken);
    return this.fileService.serveStatic(fileName, res);
  }

  @Get('title/:fileTitle')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async findByTitle(@Request() req, @Param('fileTitle') fileTitle: string) {
    this.userService.getUserInfoByToken(req.headers.authtoken);
    return this.fileService.findByTitle(fileTitle);
  }
}

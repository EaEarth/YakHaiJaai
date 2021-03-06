import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Request,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Bill } from 'entities/bills/bill.entity';
import { Item } from 'entities/items/item.entity';
import { UserService } from 'src/user/user.service';
import { BillService } from './bill.service';
import { createBill } from './dto/create-bill.dto';
import { createItem } from './dto/create-item.dto';
import { updateBill } from './dto/update-bill.dto';
import { updateItem } from './dto/update-item.dto';

@Controller('bill')
export class BillController {
  constructor(
    private readonly billService: BillService,
    private readonly userService: UserService,
  ) {}

  @Post('bill')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async storeBill(@Request() req, @Body() dto: createBill): Promise<Bill> {
    const user = await this.userService.getUserInfoByToken(
      req.headers.authtoken,
    );
    return this.billService.createBill(user, dto);
  }

  @Post('item')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async storeItem(@Request() req, @Body() dto: createItem): Promise<Item> {
    await this.userService.getUserFromToken(req.headers.authtoken);
    return this.billService.createItem(dto);
  }

  @Get('')
  async index(): Promise<Bill[]> {
    return this.billService.index();
  }

  @Get('item/index')
  async indexItem() {
    return this.billService.indexItem();
  }

  @Get('list')
  async getBillByToken(@Request() req): Promise<Bill[]> {
    const user = await this.userService.getUserFromToken(req.headers.authtoken);
    return this.billService.getBillByUid(user.uid);
  }

  @Get('get/:id')
  async getBillById(
    @Request() req,
    @Param('id', new ParseIntPipe()) id: number,
  ): Promise<Bill> {
    return this.billService.getBillById(id);
  }

  @Get('item/get/:id')
  async getItemById(
    @Request() req,
    @Param('id', new ParseIntPipe()) id: number,
  ): Promise<Item> {
    await this.userService.getUserFromToken(req.headers.authtoken);
    return this.billService.getItemById(id);
  }

  @Patch('bill/:id')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async updateBill(
    @Request() req,
    @Param('id', new ParseIntPipe()) id: number,
    @Body() dto: updateBill,
  ): Promise<Bill> {
    const user = await this.userService.getUserInfoByToken(
      req.headers.authtoken,
    );
    return this.billService.updateBill(id, user, dto);
  }

  @Patch('item/:id')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async updateItem(
    @Request() req,
    @Param('id', new ParseIntPipe()) id: number,
    @Body() dto: updateItem,
  ): Promise<Item> {
    await this.userService.getUserFromToken(req.headers.authtoken);
    return this.billService.updateItem(id, dto);
  }

  @Delete('bill/:id')
  async deleteBillById(
    @Request() req,
    @Param('id', new ParseIntPipe()) id: number,
  ) {
    await this.userService.getUserFromToken(req.headers.authtoken);
    return this.billService.deleteBillById(id);
  }

  @Delete('item/:id')
  async deleteItemById(
    @Request() req,
    @Param('id', new ParseIntPipe()) id: number,
  ) {
    await this.userService.getUserFromToken(req.headers.authtoken);
    return this.billService.deleteItemById(id);
  }
}

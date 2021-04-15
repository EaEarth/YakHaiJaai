import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Bill } from 'entities/bills/bill.entity';
import { Item } from 'entities/items/item.entity';
import { FileItemService } from 'src/file-item/file-item.service';
import { UserService } from 'src/user/user.service';
import { Repository } from 'typeorm';
import { createBill } from './dto/create-bill.dto';
import { createItem } from './dto/create-item.dto';
import { updateItem } from './dto/update-item.dto';
import { updateBill } from './dto/update-bill.dto';

@Injectable()
export class BillService {
  constructor(
    @InjectRepository(Bill) private readonly billRepo: Repository<Bill>,
    @InjectRepository(Item) private readonly itemRepo: Repository<Item>,
    private readonly userService: UserService,
    private readonly fileService: FileItemService,
  ) {}

  async createBill(dto: createBill): Promise<Bill> {
    const { itemLists, participants, qrCodeFileId, ...billInfo } = dto;
    const bill = { ...new Bill(), ...billInfo };
    bill.participants = [];
    bill.items = [];
    if (itemLists) {
      itemLists.forEach(async (itemId) => {
        bill.items.push(await this.itemRepo.findOne(itemId));
      });
    }
    if (participants) {
      participants.forEach(async (uid) => {
        bill.participants.push(await this.userService.findById(uid));
      });
    }
    if (qrCodeFileId) {
      const qrCode = await this.fileService.findById(qrCodeFileId);
      bill.qrCode = qrCode;
    }
    return this.billRepo.save(bill);
  }

  async updateBill(id, dto: updateBill): Promise<Bill> {
    const { itemLists, participants, qrCodeFileId, ...billInfo } = dto;
    const bill = await this.getBillById(id);
    if (dto.title) bill.title = dto.title;
    if (participants) {
      participants.forEach((uid) => {
        this.userService.findById(uid);
      });
    }
    return this.billRepo.save(bill);
  }

  async createItem(dto: createItem): Promise<Item> {
    const { payers, ...itemInfo } = dto;
    const item = { ...new Item(), ...itemInfo };
    item.payers = [];
    payers.forEach(async (payerId) => {
      item.payers.push(await this.userService.findById(payerId));
    });
    return this.itemRepo.save(item);
  }

  async updateItem(id: number, dto: updateItem): Promise<Item> {
    const { payers, ...itemInfo } = dto;
    const item = await this.getItemById(id);
    if (dto.name) item.name = dto.name;
    if (dto.price) item.price = dto.price;
    if (dto.payers) {
      item.payers = [];
      payers.forEach(async (payerId) => {
        item.payers.push(await this.userService.findById(payerId));
      });
    }
    return this.itemRepo.save(item);
  }

  async getItemById(id: number): Promise<Item> {
    return this.itemRepo.findOne(id, { relations: ['payers', 'bill'] });
  }

  async getBillByUid(uid: number): Promise<Bill[]> {
    return this.billRepo
      .createQueryBuilder('bill')
      .leftJoin('bill.participants', 'participants')
      .where('participants.uid = :uid', { uid: uid })
      .getMany();
  }

  async getBillById(id: number): Promise<Bill> {
    return this.billRepo
      .createQueryBuilder('bill')
      .where('bill.id = :id', { id: id })
      .leftJoinAndSelect('bill.participants', 'participants')
      .leftJoinAndSelect('bill.qrCode', 'qrCode')
      .leftJoinAndSelect('bill.items', 'items')
      .leftJoinAndSelect('items.payers', 'payers')
      .getOne();
  }

  async deleteBillById(id: number) {
    return this.billRepo.delete(id);
  }

  async deleteItemById(id: number) {
    return this.itemRepo.delete(id);
  }
}

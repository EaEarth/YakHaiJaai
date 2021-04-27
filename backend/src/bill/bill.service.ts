import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Bill } from 'entities/bills/bill.entity';
import { Item } from 'entities/items/item.entity';
import { User } from 'entities/users/user.entity';
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

  async index() : Promise<Bill[]>{
    const bill = await this.billRepo.find({relations:['participants','items']})
    console.log(bill)
    return bill
  }

  async indexItem(){
    return this.itemRepo.find({relations:["bill"]})
  }

  async createBill(user:User, dto: createBill): Promise<Bill> {
    const { itemLists, participants, qrCodeFileId, ...billInfo } = dto;
    const bill = { ...new Bill(), ...billInfo };
    bill.participants = [user];
    bill.items = [];
    // bill.owner = owner;
    var itemEntity
    if (itemLists) {
      for(const item of itemLists){
        itemEntity = await this.createItem(item)
        bill.items.push(itemEntity)
      }
    }
    if (participants) {
      let userEntity;
      for(const uid of participants){
        if(uid !== user.uid){
        userEntity = await this.userService.findById(uid)
        bill.participants.push(userEntity);
        }
      }
    }
    if (qrCodeFileId) {
      const qrCode = await this.fileService.findById(qrCodeFileId);
      bill.qrCode = qrCode;
    }
    return this.billRepo.save(bill) 
  }

  async updateBill(id, dto: updateBill): Promise<Bill> {
    const { itemLists, participants, qrCodeFileId, ...billInfo } = dto;
    const bill = await this.getBillById(id);
    let user = [];
    if (dto.title) bill.title = dto.title;
    if (participants) {
      participants.forEach(async (uid) => {
        user.push(await this.userService.findById(uid));
      });
      bill.participants = user
    }
    return this.billRepo.save(bill);
  }

  async createItem(dto: createItem): Promise<Item> {
    const { payers, ...itemInfo } = dto;
    const item = { ...new Item(), ...itemInfo };
    item.payers = [];
    var userEntity;
    for(const payer of payers){
      userEntity = await this.userService.findById(payer.uid)
      item.payers.push(userEntity);
    }
    return this.itemRepo.save(item);
  }

  async updateItem(id: number, dto: updateItem): Promise<Item> {
    const { payers, ...itemInfo } = dto;
    const item = await this.getItemById(id);
    if (dto.name) item.name = dto.name;
    if (dto.price) item.price = dto.price;
    if (dto.payers) {
      item.payers = [];
      var userEntity;
    for(const payer of payers){
      userEntity = await this.userService.findById(payer)
      item.payers.push(userEntity);
    }
    }
    return this.itemRepo.save(item);
  }

  async getItemById(id: number): Promise<Item> {
    return this.itemRepo.findOne(id, { relations: ['payers', 'bill'] });
  }

  async getBillByUid(uid: string): Promise<Bill[]> {
    return this.billRepo
      .createQueryBuilder('bill')
      .leftJoin('bill.participants', 'participants')
      .where('participants.uid = :uid', { uid: uid })
      .leftJoinAndSelect('bill.items', 'items')
      .leftJoinAndSelect('items.payers', 'payers')
      .getMany();
  }

  async getBillById(id: number): Promise<Bill> {
    return this.billRepo
      .createQueryBuilder('bill')
      .where('bill.id = :id', { id: id })
      .leftJoinAndSelect('bill.participants', 'participants')
      .leftJoinAndSelect('participants.fcmTokens', 'token')
      .leftJoinAndSelect('bill.qrCode', 'qrCode')
      .leftJoinAndSelect('bill.items', 'items')
      .leftJoinAndSelect('items.payers', 'payers')
      .leftJoinAndSelect('payers.fcmTokens', 'fcmToken')
      .getOne();
  }

  async deleteBillById(id: number) {
    return this.billRepo.delete(id);
  }

  async deleteItemById(id: number) {
    return this.itemRepo.delete(id);
  }
}

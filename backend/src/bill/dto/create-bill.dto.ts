import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class createBill {
  @IsNotEmpty()
  @IsString()
  readonly title: string;

  @IsOptional()
  readonly itemLists: any[];

  @IsOptional()
  readonly promptPay: string;

  @IsOptional()
  readonly participants: string[];

  @IsOptional()
  @IsNumber()
  readonly qrCodeFileId: number;
}

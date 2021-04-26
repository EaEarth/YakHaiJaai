import { IsNumber, IsOptional, IsString } from 'class-validator';

export class updateBill {
  @IsOptional()
  @IsString()
  readonly title: string;

  @IsOptional()
  readonly itemLists: any[];

  @IsOptional()
  readonly participants: string[];

  @IsOptional()
  @IsNumber()
  readonly qrCodeFileId: number;
}

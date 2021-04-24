import { IsNumber, IsOptional, IsString } from 'class-validator';

export class updateBill {
  @IsOptional()
  @IsString()
  readonly title: string;

  @IsOptional()
  readonly itemLists: number[];

  @IsOptional()
  readonly participants: string[];

  @IsOptional()
  @IsNumber()
  readonly qrCodeFileId: number;
}

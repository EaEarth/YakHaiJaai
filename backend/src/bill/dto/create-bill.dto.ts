import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class createBill {
  @IsNotEmpty()
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

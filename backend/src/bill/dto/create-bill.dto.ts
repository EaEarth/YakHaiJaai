import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class createBill {
  @IsNotEmpty()
  @IsString()
  readonly title: string;

  @IsOptional()
  readonly itemLists: number[];

  @IsOptional()
  readonly participants: number[];

  @IsOptional()
  @IsNumber()
  readonly qrCodeFileId: number;
}

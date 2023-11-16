import { IsDefined, IsString } from 'class-validator';

export class CryptoConfig {
  @IsString()
  @IsDefined()
  public readonly ONEINCH_API_KEY!: string;
}

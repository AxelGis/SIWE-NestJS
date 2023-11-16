import { IsDefined, IsString } from 'class-validator';

export class PrismaConfig {
  @IsString()
  @IsDefined()
  public readonly MYSQL_DB_URL!: string;
  @IsString()
  @IsDefined()
  public readonly PRISMA_FIELD_ENCRYPTION_KEY!: string;
}

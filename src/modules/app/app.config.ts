import {
  IsDefined,
  IsInt,
  IsNumber,
  IsPositive,
  IsString,
} from 'class-validator';

export class AppConfig {
  @IsNumber()
  @IsPositive()
  @IsInt()
  @IsDefined()
  public readonly APP_PORT!: number;

  @IsString()
  @IsDefined()
  public readonly FRONTEND_URL!: string;

  @IsString()
  @IsDefined()
  public readonly COOKIE_SECRET!: string;
}

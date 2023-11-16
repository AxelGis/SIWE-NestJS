import { IsBoolean, IsDefined, IsString } from 'class-validator';

export class AuthConfig {
  @IsDefined()
  @IsString()
  public readonly JWT_SECRET!: string;

  @IsDefined()
  @IsString()
  public readonly JWT_LIFETIME!: string;

  @IsBoolean()
  public readonly SKIP_AUTH: boolean = false;
}

import { IsEnum, IsOptional } from 'class-validator';
import { UserRole } from '../user.entity';

export class AdminUpdateUserDto {
  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;

  @IsOptional()
  isActive?: boolean;
}

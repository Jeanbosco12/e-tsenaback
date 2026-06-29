import { IsOptional, IsString, IsEnum } from 'class-validator';
import { MediaType } from '../media.entity'; // ✅ FIX

export class UploadMediaDto {
  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsEnum(MediaType)
  type?: MediaType;
}

export class UpdateMediaDto {
  @IsOptional()
  @IsString()
  description?: string;
}

export class MediaResponseDto {
  id: string;
  type: MediaType;
  url: string;
  description?: string;
  created_at: Date;
}
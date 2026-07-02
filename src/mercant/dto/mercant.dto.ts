import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsOptional,
  Min,
  Max,
  Length,
} from 'class-validator';

export class CreateMerchantDto {
  @IsNumber()
  @Min(-90)
  @Max(90)
  latitude: number;

  @IsNumber()
  @Min(-180)
  @Max(180)
  longitude: number;

  @IsString()
  @IsNotEmpty()
  @Length(2, 200)
  town: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsNumber()
  @Length(12, 15)
  contact: number;

  @IsString()
  @IsNotEmpty()
  @Length(2, 200)
  name: string;
}

export class UpdateMerchantDto {
  @IsOptional()
  @IsNumber()
  @Min(-90)
  @Max(90)
  latitude?: number;

  @IsOptional()
  @IsNumber()
  @Min(-180)
  @Max(180)
  longitude?: number;

  @IsOptional()
  @IsString()
  @Length(2, 200)
  town?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsNumber()
  @Length(12, 15)
  contact?: number;

  @IsString()
  @IsNotEmpty()
  @Length(2, 200)
  name?: string;
}
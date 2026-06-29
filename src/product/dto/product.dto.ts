import { 
  IsNotEmpty, 
  IsNumber, 
  IsString, 
  Length, 
  IsUUID, 
  IsOptional 
} from "class-validator";

export class CreateProductDto {

  @IsString()
  @IsNotEmpty()
  @Length(2, 150)
  name: string;

  @IsString()
  @IsNotEmpty()
  @Length(2, 300)
  description: string;

  @IsNumber()
  @IsNotEmpty()
  price: number;

  @IsNumber()
  @IsNotEmpty()
  quantity: number;

  @IsUUID()
  @IsNotEmpty()
  merchantId: string;
}


export class UpdateProductDto {

  @IsString()
  @IsOptional()
  @Length(2, 150)
  name?: string;

  @IsString()
  @IsNotEmpty()
  @Length(2, 300)
  description?: string;

  @IsNumber()
  @IsOptional()
  price?: number;

  @IsNumber()
  @IsOptional()
  quantity?: number;

  @IsUUID()
  @IsOptional()
  merchantId?: string;
}
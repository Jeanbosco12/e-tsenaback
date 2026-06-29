import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './product.entity';
import { Repository } from 'typeorm';
import { CreateProductDto } from './dto/product.dto';
import { Merchant } from 'src/mercant/mercant.entity';


@Injectable()
export class ProductService {
    constructor(
        @InjectRepository(Product)
        private readonly productRepository: Repository<Product>,

        @InjectRepository(Merchant)
        private readonly merchantRepository: Repository<Merchant>,

    ){}

  async create(productData: CreateProductDto): Promise<Product> {
  
  /*const existing = await this.productRepository.findOneBy({
    name: productData.name,
  });

  if (existing) {
    throw new BadRequestException('Name product already in use');
  }*/

  const product = this.productRepository.create(productData);
  return this.productRepository.save(product);
}


async findAll(): Promise<Product[]> {
  return this.productRepository.find();
}


//FIND BY ID MERCHANT
async findByMerchantId(merchantId: string): Promise<Product[]> {
  const merchant = await this.merchantRepository.findOneBy({id: merchantId });
  if(!merchant) {
    throw new NotFoundException(`Merchant not found`);
  }

  const product = await this.productRepository.find({
    where: {merchant: {id: merchantId} },
    relations: ['merchant'],
  });

  if(!product) {
    throw new NotFoundException(`Products of the merchant  not found`);
  }

  return product;
}


async findOne(id: string): Promise<Product> {
  const product = await this.productRepository.findOneBy({ id });

  if (!product) {
    throw new NotFoundException(`Product with ID ${id} not found`);
  }

  return product;
}


async update(id: string, productData: Partial<CreateProductDto>): Promise<Product> {
  await this.productRepository.update(id, productData);
  return this.findOne(id);
}

async remove(id: string): Promise<void> {
  const result = await this.productRepository.delete(id);

  if (result.affected === 0) {
    throw new NotFoundException(`Product with ID ${id} not found`);
  }
}
       
    
}

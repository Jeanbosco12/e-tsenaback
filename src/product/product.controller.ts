import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Post, Put,  Query,  Req,  Request,  UseGuards } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto, UpdateProductDto } from './dto/product.dto';
import { Product } from './product.entity';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';



@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}


  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() dto: CreateProductDto): Promise<Product> {
    return this.productService.create(dto);
  }

  @Get()
  async findAll(): Promise<Product[]> {
    return this.productService.findAll();
  }

  @UseGuards(JwtAuthGuard) 
  @Get('merchant/:id')
  async findbyMerchantId(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<Product[]> {
    return this.productService.findByMerchantId(id);
  }

  @Get(':id')
  async findOne(@Param('id', new ParseUUIDPipe()) id: string): Promise<Product> {
    return this.productService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: UpdateProductDto,
  ): Promise<Product> {
    return this.productService.update(id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<{ message: string }> {
    await this.productService.remove(id);
    return { message: 'Product deleted successfully' };
  }
}





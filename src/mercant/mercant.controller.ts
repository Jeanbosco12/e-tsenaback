import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  Req,
  Param,
  Put,
  Delete,
  ParseUUIDPipe,
  ForbiddenException,
} from '@nestjs/common';
import { MerchantService } from './mercant.service';
import {
  CreateMerchantDto,
  UpdateMerchantDto,
} from './dto/mercant.dto';
import { Merchant } from './mercant.entity';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('merchants')
export class MerchantController {
  constructor(private readonly merchantService: MerchantService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(
    @Body() createMerchantDto: CreateMerchantDto,
    @Req() req,
  ): Promise<Merchant> {
    const userId = req.user.sub;

    return this.merchantService.create(userId, createMerchantDto);
  }

  // PUBLIC (utile pour carte)
  @Get()
  async findAll(): Promise<Merchant[]> {
    return this.merchantService.findAll();
  }

  // PUBLIC
  @Get(':id')
  async findOne(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<Merchant> {
    return this.merchantService.findOne(id);
  }

  // MERCHANT
  @UseGuards(JwtAuthGuard)
  @Get('user/:id')
  async findbyUserId(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<Merchant> {
    return this.merchantService.findByUserId(id);
  }

  // OWNER OU ADMIN
  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateMerchantDto: UpdateMerchantDto,
    @Req() req,
  ): Promise<Merchant> {
    const merchant = await this.merchantService.findOne(id);

    if (
      merchant.user.id !== req.user.sub &&
      req.user.role !== 'admin'
    ) {
      throw new ForbiddenException('Access denied');
    }

    return this.merchantService.update(id, updateMerchantDto);
  }

  // OWNER OU ADMIN
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Req() req,
  ): Promise<{ message: string }> {
    const merchant = await this.merchantService.findOne(id);

    if (
      merchant.user.id !== req.user.sub &&
      req.user.role !== 'admin'
    ) {
      throw new ForbiddenException('Access denied');
    }

    await this.merchantService.remove(id);

    return { message: 'Merchant deleted successfully' };
  }
}
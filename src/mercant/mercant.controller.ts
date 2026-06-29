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
} from '@nestjs/common';
import { MerchantService } from './mercant.service';
import {
  CreateMerchantDto,
  UpdateMerchantDto,
} from './dto/mercant.dto';
import { Merchant } from './mercant.entity';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import type { Request } from 'express';

@Controller('merchants')
export class MerchantController {
  constructor(private readonly merchantService: MerchantService) {}

  // CREATE (auth obligatoire)
  @UseGuards(JwtAuthGuard)
  @Post()
  async create(
    @Body() createMerchantDto: CreateMerchantDto,
    @Req() req: Request,
  ): Promise<Merchant> {
    const user = req.user as any;

    return this.merchantService.create(user.id, createMerchantDto);
  }

  // PUBLIC (utile pour carte)
  @Get()
  async findAll(): Promise<Merchant[]> {
    return this.merchantService.findAll();
  }

  // PUBLIC
  @Get(':id')
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<Merchant> {
    return this.merchantService.findOne(id);
  }

  // AUTH (optionnel selon ton besoin)
  @UseGuards(JwtAuthGuard)
  @Get('user/:id')
  async findByUserId(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<Merchant> {
    return this.merchantService.findByUserId(id);
  }

  // OWNER (géré dans le service)
  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateMerchantDto: UpdateMerchantDto,
    @Req() req: Request,
  ): Promise<Merchant> {
    const user = req.user as any;

    return this.merchantService.update(
      id,
      updateMerchantDto,
      user.id, // FIX principal
    );
  }

  // OWNER (géré dans le service)
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(
    @Param('id', ParseUUIDPipe) id: string,
    @Req() req: Request,
  ): Promise<{ message: string }> {
    const user = req.user as any;

    await this.merchantService.remove(
      id,
      user.id, // FIX principal
    );

    return { message: 'Merchant deleted successfully' };
  }
}
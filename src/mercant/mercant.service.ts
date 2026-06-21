import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Merchant } from './mercant.entity';
import { User, UserRole } from '../user/user.entity';
import { CreateMerchantDto, UpdateMerchantDto } from './dto/mercant.dto';

@Injectable()
export class MerchantService {
  constructor(
    @InjectRepository(Merchant)
    private readonly merchantRepository: Repository<Merchant>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(
    userId: string,
    merchantData: CreateMerchantDto,
  ): Promise<Merchant> {
    const user = await this.userRepository.findOneBy({ id: userId });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const existing = await this.merchantRepository.findOne({
      where: { user: { id: userId } },
    });

    if (existing) {
      throw new BadRequestException('User already has a merchant');
    }

    if (user.role === UserRole.ADMIN) {
      throw new ForbiddenException('Admin cannot become merchant');
    }

    // upgrade role sécurisé
    user.role = UserRole.MERCHANT;
    await this.userRepository.save(user);

    const merchant = this.merchantRepository.create({
      ...merchantData,
      contact: merchantData.contact
        ? String(merchantData.contact)
        : undefined,
      user: { id: userId }, // optimisation
    });

    return await this.merchantRepository.save(merchant);
  }

  async findAll(): Promise<Merchant[]> {
    return this.merchantRepository.find();
  }

  async findOne(id: string): Promise<Merchant> {
    const merchant = await this.merchantRepository.findOne({
      where: { id },
    });

    if (!merchant) {
      throw new NotFoundException(`Merchant with ID ${id} not found`);
    }

    return merchant;
  }

  async findByUserId(userId: string): Promise<Merchant> {
    const merchant = await this.merchantRepository.findOne({
      where: { user: { id: userId } },
    });

    if (!merchant) {
      throw new NotFoundException(
        `Merchant for user ${userId} not found`,
      );
    }

    return merchant;
  }

  async update(
    id: string,
    merchantData: UpdateMerchantDto,
    userId: string,
  ): Promise<Merchant> {
    const merchant = await this.findOne(id);

    // ownership check
    if (merchant.user.id !== userId) {
      throw new ForbiddenException('Not your merchant');
    }

    // assign sécurisé
    merchant.name = merchantData.name ?? merchant.name;
    merchant.address = merchantData.address ?? merchant.address;
    merchant.town = merchantData.town ?? merchant.town;
    merchant.latitude = merchantData.latitude ?? merchant.latitude;
    merchant.longitude = merchantData.longitude ?? merchant.longitude;

    if (merchantData.contact) {
      merchant.contact = String(merchantData.contact);
    }

    return await this.merchantRepository.save(merchant);
  }

  async remove(id: string, userId: string): Promise<void> {
    const merchant = await this.findOne(id);

    if (merchant.user.id !== userId) {
      throw new ForbiddenException('Not your merchant');
    }

    await this.merchantRepository.remove(merchant);
  }
}
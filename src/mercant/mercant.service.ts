import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Merchant } from './mercant.entity';
import { User } from '../user/user.entity';
import { CreateMerchantDto, UpdateMerchantDto } from './dto/mercant.dto';
import { UserRole } from '../user/user.entity';

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
      relations: ['user'],
    });

    if (existing) {
      throw new BadRequestException('User is already a merchant');
    }

    // upgrade role
    user.role = UserRole.MERCHANT;
    await this.userRepository.save(user);

    const merchant = this.merchantRepository.create({
      ...merchantData,
      user,
    });

    return this.merchantRepository.save(merchant);
  }

  // FIND ALL
  async findAll(): Promise<Merchant[]> {
    return this.merchantRepository.find({
      relations: ['user'],
    });
  }

  // FIND ONE
  async findOne(id: string): Promise<Merchant> {
    const merchant = await this.merchantRepository.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!merchant) {
      throw new NotFoundException(`Merchant with ID ${id} not found`);
    }

    return merchant;
  }

  // FIND BY ID USER
  async findByUserId(userId: string): Promise<Merchant> {
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const merchant = await this.merchantRepository.findOne({
      where: { user: {id: userId} },
      relations: ['user'],
    });

    if (!merchant) {
      throw new NotFoundException(`Merchant with ID user ${userId} not found`);
    }

    return merchant;
  }

  // UPDATE
  async update(
    id: string,
    merchantData: UpdateMerchantDto,
  ): Promise<Merchant> {
    const merchant = await this.findOne(id);

    Object.assign(merchant, merchantData);

    return this.merchantRepository.save(merchant);
  }

  // DELETE
  async remove(id: string, userId: string): Promise<void> {
    const merchant = await this.findOne(id);

    if (merchant.user.id != userId) {
      throw new ForbiddenException('Not your mercant')
    }
    await this.merchantRepository.remove(merchant);
  }
}
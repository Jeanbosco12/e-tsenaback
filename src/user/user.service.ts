import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { v2 as cloudinary } from 'cloudinary';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  // CREATE
  async create(userData: CreateUserDto): Promise<User> {
    const existingUser = await this.userRepository.findOneBy({
      email: userData.email,
    });

    if (existingUser) {
      throw new BadRequestException('Email already in use');
    }

    const hashedPassword = await bcrypt.hash(userData.password, 10);

    const user = this.userRepository.create({
      ...userData,
      password: hashedPassword,
    });

    return this.userRepository.save(user);
  }

  // FIND ALL
  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  // FIND ONE
  async findOne(id: string): Promise<User> {
    const user = await this.userRepository.findOneBy({ id });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return user;
  }

  // 🔐 IMPORTANT pour login
  async findByEmailWithPassword(email: string): Promise<User | null> {
    return this.userRepository
      .createQueryBuilder('user')
      .addSelect('user.password')
      .where('user.email = :email', { email })
      .getOne();
  }

  // ✅ UPDATE sécurisé
  async update(id: string, userData: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);

    if (userData.password) {
      user.password = await bcrypt.hash(userData.password, 10);
    }

    Object.assign(user, userData);

    return this.userRepository.save(user);
  }

  // ✅ DELETE
  async remove(id: string): Promise<void> {
    const user = await this.findOne(id);
    await this.userRepository.remove(user);
  }
}

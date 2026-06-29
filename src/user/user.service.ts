<<<<<<< HEAD
import { 
  BadRequestException, 
  Injectable, 
  NotFoundException 
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';
import { 
  CreateUserDto, 
  UpdateUserDto 
} from './dto/user.dto';
=======
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User, UserRole, UserStatus } from './user.entity';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';
>>>>>>> 532c880be8cc427983f461d3acf08280dadd2022

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

<<<<<<< HEAD
//CREATE
  async create(userData: CreateUserDto): Promise<User> {
    const existingUser = await this.userRepository.findOneBy({
      email: userData.email,
    });

    if(existingUser) {
      throw new BadRequestException('Email already in use')
=======
  async create(userData: CreateUserDto): Promise<User> {
    const email = userData.email.trim().toLowerCase();

    const existingUser = await this.userRepository.findOneBy({ email });
    if (existingUser) {
      throw new BadRequestException('Email already in use');
>>>>>>> 532c880be8cc427983f461d3acf08280dadd2022
    }

    const hashedPassword = await bcrypt.hash(userData.password, 10);

    const user = this.userRepository.create({
      ...userData,
<<<<<<< HEAD
=======
      email,
>>>>>>> 532c880be8cc427983f461d3acf08280dadd2022
      password: hashedPassword,
    });

    return this.userRepository.save(user);
  }

<<<<<<< HEAD
  //FIND ALL
  async findAll(): Promise<User[]> {
    return this.userRepository.find();
=======
  async findAll(): Promise<User[]> {
    return this.userRepository.find({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
        created_at: true,
        updated_at: true,
      } as any,
    });
>>>>>>> 532c880be8cc427983f461d3acf08280dadd2022
  }

  async findOne(id: string): Promise<User> {
    const user = await this.userRepository.findOneBy({ id });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return user;
  }
<<<<<<< HEAD
 

  //GET ID USER BY EMAIL
  async findByEmail(email: string): Promise<User> {
    const user = await this.userRepository.findOneBy({ email });
    if (!user) {
      throw new NotFoundException(`User with email ${email} not found`);
    }
    return user;

  }

  // IMPORTANT pour login
  async findByEmailWithPassword(email: string): Promise<User | null> {
    return this.userRepository
    .createQueryBuilder('user')
    .addSelect('user.password')
    .where('user.email = :email', { email })
    .getOne();
  }

  // UPDATE sécurisé
  async update(id: string, userData: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);

    // Hash password si modifié
    if (userData.password) {
      user.password = await bcrypt.hash(userData.password, 10);
    }

    Object.assign(user, userData.password);
=======

  async findByEmailWithPassword(email: string): Promise<User | null> {
    return this.userRepository
      .createQueryBuilder('user')
      .addSelect('user.password')
      .where('LOWER(user.email) = LOWER(:email)', { email: email.trim() })
      .getOne();
  }

  async update(id: string, userData: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);

    if (userData.name !== undefined) {
      user.name = userData.name.trim();
    }

    if (userData.email !== undefined) {
      const normalizedEmail = userData.email.trim().toLowerCase();

      const existing = await this.userRepository.findOneBy({ email: normalizedEmail });
      if (existing && existing.id !== id) {
        throw new BadRequestException('Email already in use');
      }

      user.email = normalizedEmail;
    }

    if (userData.password !== undefined) {
      if (userData.password.length < 8) {
        throw new BadRequestException('Password too short');
      }
      user.password = await bcrypt.hash(userData.password, 10);
    }

    return this.userRepository.save(user);
  }

  async adminUpdate(
    id: string,
    data: { role?: UserRole; status?: UserStatus },
  ): Promise<User> {
    const user = await this.findOne(id);

    if (data.role !== undefined) {
      user.role = data.role;
    }

    if (data.status !== undefined) {
      user.status = data.status;
    }
>>>>>>> 532c880be8cc427983f461d3acf08280dadd2022

    return this.userRepository.save(user);
  }

<<<<<<< HEAD
  //DELETE
=======
>>>>>>> 532c880be8cc427983f461d3acf08280dadd2022
  async remove(id: string): Promise<void> {
    const user = await this.findOne(id);
    await this.userRepository.remove(user);
  }
<<<<<<< HEAD

  
}
=======
}
>>>>>>> 532c880be8cc427983f461d3acf08280dadd2022

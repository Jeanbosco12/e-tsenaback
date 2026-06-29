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

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

//CREATE
  async create(userData: CreateUserDto): Promise<User> {
    const existingUser = await this.userRepository.findOneBy({
      email: userData.email,
    });

    if(existingUser) {
      throw new BadRequestException('Email already in use')
    }

    const hashedPassword = await bcrypt.hash(userData.password, 10);

    const user = this.userRepository.create({
      ...userData,
      password: hashedPassword,
    });

    return this.userRepository.save(user);
  }

  //FIND ALL
  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async findOne(id: string): Promise<User> {
    const user = await this.userRepository.findOneBy({ id });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return user;
  }
 

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

    return this.userRepository.save(user);
  }

  //DELETE
  async remove(id: string): Promise<void> {
    const user = await this.findOne(id);
    await this.userRepository.remove(user);
  }

  
}

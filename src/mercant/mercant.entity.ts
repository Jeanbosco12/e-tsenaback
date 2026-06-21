import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
  Index,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../user/user.entity';

@Entity('merchants')
@Index(['latitude', 'longitude'])
export class Merchant {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => User, { onDelete: 'CASCADE', eager: false })
  @JoinColumn()
  user: User;

  @Column('decimal', { precision: 10, scale: 7 })
  latitude: number;

  @Column('decimal', { precision: 10, scale: 7 })
  longitude: number;

  @Column({ length: 200 })
  town: string;

  @Column({ nullable: true, length: 255 })
  address?: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  contact?: string;

  @Column({ length: 200 })
  name: string;

  @Column({ type: 'float', default: 0 })
  rating: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
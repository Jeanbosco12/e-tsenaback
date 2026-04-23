import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../user/user.entity';

@Entity('merchants')
export class Merchant {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // 🔗 relation avec user
  @OneToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn()
  user: User;

  @Column('float')
  latitude: number;

  @Column('float')
  longitude: number;

  @Column({ length: 200 })
  town: string;

  @Column({ nullable: true })
  address: string;

   @Column({ length: 200 })
  name: string;

  @Column({ type: 'float', default: 0 })
  rating: number;
}
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { User } from '../user/user.entity';
import { Product } from 'src/product/product.entity';

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

  //Un mercant a plusieur product(1,N)
  @OneToMany(() => Product, (product) => product.merchant)
  products: Product[];
}
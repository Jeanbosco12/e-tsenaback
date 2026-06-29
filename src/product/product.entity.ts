import { Merchant } from 'src/mercant/mercant.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  JoinColumn,
  ManyToOne,
} from 'typeorm';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 150 })
  name: string;

  @Column({length: 300 })
  description: string;

  @Column({ type: 'int' })
  price: number;

  @Column({ type: 'int' })
  quantity: number;

  @CreateDateColumn()
  created_at: Date;

  // clé étrangère
  @Column({ type: 'uuid' })
  merchantId: string;

  @ManyToOne(() => Merchant, (merchant) => merchant.products)
  @JoinColumn({ name: 'merchantId' })
  merchant: Merchant;
}
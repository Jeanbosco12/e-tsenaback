import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
<<<<<<< HEAD
=======
  Index,
>>>>>>> 532c880be8cc427983f461d3acf08280dadd2022
} from 'typeorm';

export enum UserRole {
  USER = 'user',
  MERCHANT = 'merchant',
  ADMIN = 'admin',
}

export enum UserStatus {
  ACTIVE = 'active',
  DISABLED = 'disabled',
  PENDING = 'pending',
}

<<<<<<< HEAD

=======
>>>>>>> 532c880be8cc427983f461d3acf08280dadd2022
@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100 })
  name: string;

<<<<<<< HEAD
  @Column({ length: 150, unique: true })
  email: string;

  @Column({type: 'text', select: false })
  password: string;

  @Column({ 
=======
  @Index({ unique: true })
  @Column({ length: 150, unique: true })
  email: string;

  @Column({ type: 'text', select: false })
  password: string;

  @Column({
>>>>>>> 532c880be8cc427983f461d3acf08280dadd2022
    type: 'enum',
    enum: UserRole,
    default: UserRole.USER,
  })
<<<<<<< HEAD
  role: UserRole
  

  @Column({nullable: true})
  photo: string;
=======
  role: UserRole;

  @Column({ type: 'varchar', length: 255, nullable: true })
  photo: string | null;
>>>>>>> 532c880be8cc427983f461d3acf08280dadd2022

  @Column({
    type: 'enum',
    enum: UserStatus,
    default: UserStatus.PENDING,
  })
  status: UserStatus;

<<<<<<< HEAD
  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
=======
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
>>>>>>> 532c880be8cc427983f461d3acf08280dadd2022

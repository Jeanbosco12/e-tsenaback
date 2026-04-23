import { Module } from '@nestjs/common';
import { MerchantService } from './mercant.service';
import { MerchantController } from './mercant.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Merchant } from './mercant.entity';
import { User } from 'src/user/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Merchant,User])],
  providers: [MerchantService],
  controllers: [MerchantController],
  exports: [MerchantService],
})
export class MercantModule {}

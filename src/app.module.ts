import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ProductModule } from './product/product.module';
import { MercantModule } from './mercant/mercant.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: '1111',
      database: 'etsenantsika',
      autoLoadEntities: true,
      synchronize: true, // Disable in production
    }),
    UserModule,
    AuthModule,
    ProductModule,
    MercantModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
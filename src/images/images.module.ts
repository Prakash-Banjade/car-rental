import { Module } from '@nestjs/common';
import { ImagesService } from './images.service';
import { ImagesController } from './images.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Image } from './entities/image.entity';
import { UsersModule } from 'src/users/users.module';
import { AccountsModule } from 'src/accounts/accounts.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Image]),
    AccountsModule,
  ],
  controllers: [ImagesController],
  providers: [ImagesService],
})
export class ImagesModule { }

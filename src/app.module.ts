require('dotenv').config();

import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { configService } from './config/db.config';
import { UsersModule } from './users/users.module';
import { MemoryStoredFile, NestjsFormDataModule } from 'nestjs-form-data';
import { AuthModule } from './auth/auth.module';
import { CaslModule } from './casl/casl.module';
import { APP_GUARD, APP_INTERCEPTOR, RouterModule } from '@nestjs/core';
import { AuthGuard } from './auth/guards/auth.guard';
import { AbilitiesGuard } from './casl/guards/abilities.guard';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { CacheInterceptor, CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-store';
import { MailModule } from './mail/mail.module';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AccountsModule } from './accounts/accounts.module';
import { AddressesModule } from './addresses/addresses.module';
import { ImagesModule } from './images/images.module';
import { BrandsModule } from './brands/brands.module';
import { CarTypesModule } from './car-types/car-types.module';
import { ModelsModule } from './models/models.module';
import { ReviewsModule } from './reviews/reviews.module';
import { RentalsModule } from './rentals/rentals.module';
import { StripeModule } from './stripe/stripe.module';
import { PaymentsModule } from './payments/payments.module';
import { AppSettingsModule } from './app-settings/app-settings.module';
import { NewsletterModule } from './newsletter/newsletter.module';
import { BlogsModule } from './blogs/blogs.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(configService),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    NestjsFormDataModule.config({
      storage: MemoryStoredFile,
      isGlobal: true,
      fileSystemStoragePath: 'public',
      autoDeleteFile: false,
      limits: {
        files: 10,
        fileSize: 5 * 1024 * 1024,
      },
      cleanupAfterSuccessHandle: false, // !important
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'), // serve static files eg: localhost:3000/filename.png
    }),
    StripeModule.forRootAsync(),
    ThrottlerModule.forRoot([{
      ttl: 60000, // 10 requests per minute
      limit: 10,
    }]),
    // CacheModule.register({
    //   ttl: 5, // seconds
    //   max: 10, // maximum number of items in cache
    //   // @ts-ignore
    //   store: async () => await redisStore({
    //     // Store-specific configuration:
    //     socket: {
    //       host: process.env.REDIS_HOST,
    //       port: +process.env.REDIS_PORT,
    //     }
    //   })
    // }),
    UsersModule,
    AuthModule,
    CaslModule,
    MailModule,
    AccountsModule,
    AddressesModule,
    ImagesModule,
    RouterModule.register([
      {
        path: 'upload',
        module: ImagesModule,
      },
    ]),
    BrandsModule,
    CarTypesModule,
    ModelsModule,
    ReviewsModule,
    RentalsModule,
    PaymentsModule,
    AppSettingsModule,
    NewsletterModule,
    BlogsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard, // global auth guard
    },
    {
      provide: APP_GUARD,
      useClass: AbilitiesGuard, // global ability guard
    },
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard, // global rate limiting, but can be overriden in route level
    },
    // {
    //   provide: APP_INTERCEPTOR,
    //   useClass: CacheInterceptor, // global caching, only get requests will be cached
    // },
  ],
})
export class AppModule { }

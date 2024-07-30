import { Module } from '@nestjs/common';
import { NewsletterService } from './newsletter.service';
import { NewsletterController } from './newsletter.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Newsletter } from './entities/newsletter.entity';
import { NewsLetterSubscribeRequest } from './entities/newsLetter-subscribe-request.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Newsletter,
      NewsLetterSubscribeRequest,
    ]),
  ],
  controllers: [NewsletterController],
  providers: [NewsletterService],
})
export class NewsletterModule { }

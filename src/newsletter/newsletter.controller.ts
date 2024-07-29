import { Controller, Get, Post, Body } from '@nestjs/common';
import { NewsletterService } from './newsletter.service';
import { CreateNewsletterDto, SubscribeNewsletterDto, UnSubscribeNewsletterDto } from './dto/create-newsletter.dto';
import { ApiTags } from '@nestjs/swagger';
import { Public } from 'src/core/decorators/setPublicRoute.decorator';

@Public()
@ApiTags('Newsletter')
@Controller('newsletter')
export class NewsletterController {
  constructor(private readonly newsletterService: NewsletterService) { }

  @Post('subscribeRequest')
  subscribeRequest(@Body() createNewsletterDto: CreateNewsletterDto) {
    return this.newsletterService.subscribeRequest(createNewsletterDto);
  }

  @Post('subscribeNewsletter')
  subscribeNewsletter(@Body() { verificationToken }: SubscribeNewsletterDto) {
    return this.newsletterService.subscribeNewsletter(verificationToken);
  }

  @Post('unsubscribe')
  unSubscribe(@Body() { token }: UnSubscribeNewsletterDto) {
    return this.newsletterService.unSubscribe(token);
  }

}

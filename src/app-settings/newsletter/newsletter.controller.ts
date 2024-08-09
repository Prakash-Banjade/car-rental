import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { CreateNewsletterDto, SubscribeNewsletterDto, UnSubscribeNewsletterDto } from './dto/create-newsletter.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Public } from 'src/core/decorators/setPublicRoute.decorator';
import { QueryDto } from 'src/core/dto/query.dto';
import { NewsletterService } from './newsletter.service';

@ApiTags('Newsletter')
@Controller('newsletters')
export class NewsletterController {
  constructor(private readonly newsletterService: NewsletterService) { }

  @ApiBearerAuth()
  @Get()
  findAll(@Query() queryDto: QueryDto) {
    return this.newsletterService.findAll(queryDto);
  }

  @Public()
  @Post('subscribeRequest')
  subscribeRequest(@Body() createNewsletterDto: CreateNewsletterDto) {
    return this.newsletterService.subscribeRequest(createNewsletterDto);
  }

  @Public()
  @Post('subscribeNewsletter')
  subscribeNewsletter(@Body() { verificationToken }: SubscribeNewsletterDto) {
    return this.newsletterService.subscribeNewsletter(verificationToken);
  }

  @Public()
  @Post('unsubscribe')
  unSubscribe(@Body() { token }: UnSubscribeNewsletterDto) {
    return this.newsletterService.unSubscribe(token);
  }

}

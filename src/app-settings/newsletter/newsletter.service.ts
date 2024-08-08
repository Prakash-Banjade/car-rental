import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateNewsletterDto } from './dto/create-newsletter.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Newsletter } from './entities/newsletter.entity';
import { Repository } from 'typeorm';
import { MailService } from 'src/mail/mail.service';
import { NewsLetterSubscribeRequest } from './entities/newsLetter-subscribe-request.entity';
import crypto from 'crypto'
import { QueryDto } from 'src/core/dto/query.dto';
import paginatedData from 'src/core/utils/paginatedData';

@Injectable()
export class NewsletterService {
  constructor(
    @InjectRepository(Newsletter) private readonly newsletterRepo: Repository<Newsletter>,
    @InjectRepository(NewsLetterSubscribeRequest) private readonly newsletterSubscribeRequestRepo: Repository<NewsLetterSubscribeRequest>,
    private readonly mailService: MailService,
  ) { }

  async findAll(queryDto: QueryDto) {
    const querybuilder = this.newsletterRepo.createQueryBuilder('newsletter')

    querybuilder
      .orderBy("newsletter.createdAt", queryDto.order)
      .skip(queryDto.skip)
      .take(queryDto.take)

    return paginatedData(queryDto, querybuilder)
  }

  async subscribeRequest(createNewsletterDto: CreateNewsletterDto) {
    const existing = await this.newsletterSubscribeRequestRepo.findOne({ where: { email: createNewsletterDto.email } });
    if (existing) return {
      message: 'Subscribed',
    };

    /**
    |--------------------------------------------------
    | CREATE SUBSCRIBE REQUEST
    |--------------------------------------------------
    */

    // GENERATE TOKEN
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const hashedVerificationToken = crypto
      .createHash('sha256')
      .update(verificationToken)
      .digest('hex');

    // SAVE IN DB
    const subscribeRequest = this.newsletterSubscribeRequestRepo.create({
      email: createNewsletterDto.email,
      hashedVerificationToken,
    });
    await this.newsletterSubscribeRequestRepo.save(subscribeRequest);

    // SEND EMAIL
    await this.mailService.sendNewsletterVerification(createNewsletterDto.email, verificationToken);
    return {
      message: 'Please verify your email to subscribe to our newsletter',
    };
  }

  async subscribeNewsletter(verificationToken: string) {
    // GET HASH VALUE OF THE PROVIDED TOKEN TO CHECK IN DB
    const hashedVerificationToken = crypto
      .createHash('sha256')
      .update(verificationToken)
      .digest('hex');

    const subscribeRequest = await this.newsletterSubscribeRequestRepo.findOneBy({ hashedVerificationToken });

    if (!subscribeRequest) throw new BadRequestException('Invalid verification token');

    // ADD EMAIL TO NEWSLETTER TABLE
    const newsletter = this.newsletterRepo.create({
      email: subscribeRequest.email,
      token: verificationToken,
    });
    await this.newsletterRepo.save(newsletter);

    // REMOVE REQUEST FROM DB
    await this.newsletterSubscribeRequestRepo.remove(subscribeRequest);

    // SEND MAIL TO NITOFY
    await this.mailService.subscribeConfirmationNotify(subscribeRequest.email, verificationToken);

    return {
      message: 'Thanks for subscribing',
    }
  }

  async unSubscribe(token: string) {
    const newsletter = await this.newsletterRepo.findOneBy({ token });
    if (!newsletter) throw new BadRequestException('Invalid token');

    await this.newsletterRepo.remove(newsletter);

    // SEND MAIL
    await this.mailService.unSubscribeNotify(newsletter.email);

    return {
      message: 'Unsubscribed',
    }
  }

}

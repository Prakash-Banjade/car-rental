import { Global, Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { join } from 'path';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';

@Global()
@Module({
  imports: [
    MailerModule.forRootAsync({
      useFactory: async () => {
        const outgoingServer = process.env.MAIL_OUTGOING_SERVER;
        const smtpPort = parseInt(process.env.MAIL_SMTP_PORT);
        const username = process.env.MAIL_USERNAME;
        const password = process.env.MAIL_PASSWORD;

        return {
          transport: {
            host: outgoingServer,
            port: smtpPort,
            secure: smtpPort === 465, // true for 465, false for other ports
            auth: {
              user: username,
              pass: password
            }
          },
          defaults: {
            from: `"No Reply" <${username}>`,
          },
          template: {
            dir: join(__dirname, 'templates'),
            adapter: new HandlebarsAdapter(),
            options: {
              strict: true,
            },
          },
        };
      },
    }),
  ],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule { }

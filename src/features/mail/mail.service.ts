import { MailerService } from '@nestjs-modules/mailer';
import { InjectQueue } from '@nestjs/bullmq';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Queue } from 'bullmq';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  constructor(
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService,
    @InjectQueue('mail') private readonly mailQueue: Queue,
  ) {}

  async sendMail(props: {
    to: string;
    cc?: any[];
    subject: string;
    template: string;
    context: any;
  }) {
    const { to, cc, subject, template } = props;
    try {
      await this.mailerService.sendMail({
        from: this.configService.get('EMAIL_USER'),
        to,
        cc,
        subject,
        template,
        context: {
          ...props.context,
        },
      });
    } catch (error) {
      this.logger.error(error);
    }
  }

  async sendMailJob() {
    this.mailQueue.add(
      'mail-job',
      {
        to: 'hi',
      },
      {
        removeOnComplete: true,
        delay: 2000,
      },
    );
  }
}

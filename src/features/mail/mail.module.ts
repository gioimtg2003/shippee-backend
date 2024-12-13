import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { EmailConsumer } from './email.consumer';
import { MailController } from './mail.controller';
import { MailService } from './mail.service';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'mail',
    }),
  ],
  controllers: [MailController],
  providers: [MailService, EmailConsumer],
  exports: [MailService],
})
export class MailModule {}

import { Controller, Post } from '@nestjs/common';
import { MailService } from './mail.service';

@Controller('mail')
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @Post()
  sendMail() {
    this.mailService.sendMail({
      to: 'conggioi.pro264@gmail.com',
      subject: 'Hello',
      template: './manage-create-driver',
      context: {
        name: 'Cong Gioi',
        phoneDriver: '0123456789',
        passwordDriver: '213asdasdo923234',
      },
    });
    return true;
  }
}

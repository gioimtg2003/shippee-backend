import { Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { MailService } from './mail.service';

@ApiTags('mail')
@Controller('mail')
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @Post()
  @ApiOperation({ summary: 'Send mail' })
  sendMail() {
    const line = `
    <tr>
      <td align='left' style='padding:0;Margin:0'>
      <p style="Margin:0;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;letter-spacing:0;color:#333333;font-size:14px"
                                    >Chúng tôi hihi hih ihi hi hi hih bạn
                                      .</p><p
                                      style="Margin:0;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;letter-spacing:0;color:#333333;font-size:14px"
                                    ><br /></p></td>
        </tr>
    `;
    this.mailService.sendMail({
      to: 'conggioi.pro264@gmail.com',
      subject: 'Hello',
      template: './under-age',
      context: {
        name: 'Giới',
        contactEmail: 'support@nguyenconggioi.me',
        line: line,
      },
    });
    return true;
  }

  @Post('job')
  @ApiOperation({ summary: 'Send mail job' })
  sendMailJob() {
    this.mailService.sendMailJob();
    return true;
  }
}

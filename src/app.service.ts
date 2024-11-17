import { AdminService } from '@features/admin/admin.service';
import { Injectable, OnModuleInit } from '@nestjs/common';

@Injectable()
export class AppService implements OnModuleInit {
  constructor(private adminService: AdminService) {}
  async onModuleInit() {
    try {
      await this.adminService.findByUserName(process.env.ADMIN_USERNAME);
    } catch {
      await this.adminService.create({
        username: process.env.ADMIN_USERNAME.trim(),
        password: process.env.ADMIN_PASSWORD.trim(),
        name: process.env.ADMIN_NAME,
      });
    }
  }
}

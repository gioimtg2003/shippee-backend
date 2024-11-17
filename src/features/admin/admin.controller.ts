import { CurrentUser } from '@decorators';
import { AdminAuthGuard } from '@features/auth-admin/guards';
import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AdminService } from './admin.service';
import { ResponseMeDTO } from './dto/response-me.dto';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @ApiOperation({ summary: 'Get admin profile' })
  @ApiResponse({
    status: 200,
    description: 'Successful get admin profile',
    type: ResponseMeDTO,
  })
  @Get('me')
  @UseGuards(AdminAuthGuard)
  meProfile(@CurrentUser() user: any) {
    return this.adminService.getMeProfile(user.id);
  }
}

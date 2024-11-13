import { Controller } from '@nestjs/common';
import { AuthAdminService } from './auth-admin.service';

@Controller('auth-admin')
export class AuthAdminController {
  constructor(private readonly authAdminService: AuthAdminService) {}
}

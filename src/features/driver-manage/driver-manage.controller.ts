import { AdminAuthGuard } from '@features/auth-admin/guards';
import {
  CreateDriverInput,
  ResponseCreateDriverDTO,
} from '@features/driver/dto';
import {
  CreateDriverInfoInput,
  ResponseCreateDriverInfoDTO,
} from '@features/driver/dto/create-driver-info.input';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Logger,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { DriverManageService } from './driver-manage.service';
import { ResponseGetAllDriverDTO } from './dto';

@ApiTags('driver-manage')
@Controller('driver-manage')
export class DriverManageController {
  private readonly logger = new Logger(DriverManageController.name);
  constructor(private readonly driverManageService: DriverManageService) {}

  @ApiOperation({ summary: 'Create a driver' })
  @ApiResponse({
    status: 201,
    description: 'Driver created',
    type: ResponseCreateDriverDTO,
  })
  @Post('driver')
  @UseGuards(AdminAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  async createDriver(@Body() data: CreateDriverInput) {
    const driver = await this.driverManageService.createDriver(data);
    if (driver) {
      this.logger.log('Driver created successfully');
      return true;
    }

    return false;
  }

  @ApiOperation({ summary: 'Get all driver' })
  @ApiResponse({
    status: 200,
    description: 'Get all driver',
    type: ResponseGetAllDriverDTO,
  })
  @Get('driver')
  @UseGuards(AdminAuthGuard)
  @HttpCode(HttpStatus.OK)
  async getAllDriver() {
    return this.driverManageService.getAllDriver();
  }

  @ApiOperation({ summary: 'Create a driver' })
  @ApiResponse({
    status: 201,
    description: 'Driver created',
    type: ResponseCreateDriverInfoDTO,
  })
  @Post('driver/info')
  createInfo(@Body() data: CreateDriverInfoInput) {
    return this.driverManageService.createDriverInfo(data);
  }
}

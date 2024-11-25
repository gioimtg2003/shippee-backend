import { AdminAuthGuard } from '@features/auth-admin/guards';
import { CreateDriverInput } from '@features/driver/dto';
import {
  CreateDriverInfoInput,
  ResponseCreateDriverInfoDTO,
} from '@features/driver/dto/create-driver-info.input';
import { UpdateDriverInfoInput } from '@features/driver/dto/update-driver-info.input';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Logger,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  ApiArrayResponse,
  ApiSuccessResponse,
} from 'src/decorators/response-swagger.decorator';
import { DriverManageService } from './driver-manage.service';

@ApiTags('driver-manage')
@Controller('driver-manage')
export class DriverManageController {
  private readonly logger = new Logger(DriverManageController.name);
  constructor(private readonly driverManageService: DriverManageService) {}

  @ApiOperation({ summary: 'Create a driver' })
  @ApiSuccessResponse('Driver created')
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
  @ApiArrayResponse(CreateDriverInput)
  @Get('driver')
  @UseGuards(AdminAuthGuard)
  @HttpCode(HttpStatus.OK)
  async getAllDriver() {
    return this.driverManageService.getAllDriver();
  }

  @ApiOperation({ summary: 'Create a partner identification info' })
  @ApiResponse({
    status: 201,
    description: 'Partner created',
    type: ResponseCreateDriverInfoDTO,
  })
  @Post('driver/info')
  @UseGuards(AdminAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  createInfo(@Body() data: CreateDriverInfoInput) {
    return this.driverManageService.createDriverInfo(data);
  }

  @ApiOperation({ summary: 'Create a partner identification info' })
  @ApiSuccessResponse('Update partner identification info')
  @Put('driver/info')
  @UseGuards(AdminAuthGuard)
  @HttpCode(HttpStatus.OK)
  updateInfo(@Body() data: UpdateDriverInfoInput) {
    return this.driverManageService.updateDriverInfo(data);
  }
}

import { AdminAuthGuard } from '@features/auth-admin/guards';
import { WalletPaginateDto } from '@features/driver-wallet/dto';
import { WalletHistoryEntity } from '@features/driver-wallet/entities';
import { CreateDriverInput } from '@features/driver/dto';
import { CreateDriverInfoInput } from '@features/driver/dto/create-driver-info.input';
import { UpdateDriverInfoInput } from '@features/driver/dto/update-driver-info.input';
import { UpdateDriverInput } from '@features/driver/dto/update-driver.input';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Logger,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  ApiArrayResponse,
  ApiObjectResponse,
  ApiSuccessResponse,
} from 'src/decorators/response-swagger.decorator';
import { FilterQuery, FilterWallet } from './decorators';
import { DriverManageService } from './driver-manage.service';
import { FilterDriverOptionsDto } from './dto';
import { CountDriverDto } from './dto/count-driver.dto';

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
  @UsePipes(new ValidationPipe({ transform: true }))
  async getAllDriver(@FilterQuery() filter: FilterDriverOptionsDto) {
    return this.driverManageService.getAllDriver(filter);
  }

  @ApiOperation({ summary: 'Get all driver' })
  @ApiArrayResponse(WalletHistoryEntity)
  @Get('driver/wallet')
  @UseGuards(AdminAuthGuard)
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe({ transform: true }))
  async getAllDriverWallet(@FilterWallet() filter: WalletPaginateDto) {
    return this.driverManageService.getAllDriverWallet(filter);
  }

  @ApiOperation({ summary: 'Update a driver' })
  @ApiSuccessResponse('Driver updated')
  @Put('driver')
  @UseGuards(AdminAuthGuard)
  @HttpCode(HttpStatus.OK)
  async updateDriver(@Body() data: UpdateDriverInput) {
    return this.driverManageService.updateDriver(data);
  }

  @ApiOperation({ summary: 'Get details driver' })
  @Get('driver/:id')
  @UseGuards(AdminAuthGuard)
  @HttpCode(HttpStatus.OK)
  async getDriver(
    @Query('relations') relations: string,
    @Param('id') id: number,
  ) {
    if (!relations) {
      return this.driverManageService.getDriverById(id);
    }

    relations = relations.trim();

    if (relations === '') {
      return this.driverManageService.getDriverById(id);
    }

    const relationsArray = relations.split(',');
    return this.driverManageService.getDriverById(id, relationsArray);
  }

  @ApiOperation({ summary: 'Create a partner identification info' })
  @ApiObjectResponse(CreateDriverInfoInput)
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
    return this.driverManageService.updateDriverInfo(data, 1);
  }

  @ApiOperation({ summary: 'Count driver' })
  @ApiOkResponse({
    type: Number,
    example: 10,
    description: 'Number of drivers with the given filter',
  })
  @Post('driver/count')
  @UseGuards(AdminAuthGuard)
  @HttpCode(HttpStatus.OK)
  countDriver(@Body() filter: CountDriverDto) {
    return this.driverManageService.countDriver(filter);
  }

  @ApiOperation({ summary: 'Verify driver' })
  @ApiSuccessResponse('Driver verified')
  @Post('driver/verify')
  @UseGuards(AdminAuthGuard)
  @HttpCode(HttpStatus.OK)
  verifyDriver(@Body('idDriver', new ValidationPipe()) data: number) {
    return this.driverManageService.verifyDriver(data);
  }

  @ApiOperation({ summary: 'Delete driver' })
  @ApiSuccessResponse('Driver deleted')
  @Delete('driver/:id')
  @UseGuards(AdminAuthGuard)
  @HttpCode(HttpStatus.OK)
  deleteDriver(@Param('id') data: number) {
    return this.driverManageService.softDeleteDriver(data);
  }
}

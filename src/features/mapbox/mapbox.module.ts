import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { MapBoxService } from './mapbox.service';

@Module({
  imports: [HttpModule],
  controllers: [],
  providers: [MapBoxService],
  exports: [MapBoxService],
})
export class MapBoxModule {}

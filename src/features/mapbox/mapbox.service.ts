import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { IDirectionMapBox } from 'src/interfaces/mapbox.interface';

@Injectable()
export class MapBoxService {
  private readonly logger = new Logger(MapBoxService.name);
  constructor(private readonly httpService: HttpService) {}

  /**
   * Calculates the driving distance between two geographical points using the Mapbox Directions API.
   *
   * @param origin - The starting point as a tuple of latitude and longitude.
   * @param destination - The ending point as a tuple of latitude and longitude.
   * @returns The distance in meters between the origin and destination.
   */
  async getDistance(origin: [number, number], destination: [number, number]) {
    this.logger.log(`Getting distance between ${origin} and ${destination}`);
    const response = await firstValueFrom(
      this.httpService.get<IDirectionMapBox>(
        `https://api.mapbox.com/directions/v5/mapbox/driving/${origin[1]},${origin[0]};${destination[1]},${destination[0]}?alternatives=true&geometries=geojson&language=en&overview=full&steps=true&access_token=${process.env.MAPBOX_ACCESS_TOKEN}`,
      ),
    );
    return response.data;
  }
}

import { IRedisRecord } from '@interfaces';

export class CacheValueEvent {
  constructor(
    public record: IRedisRecord,
    public expires: number,
  ) {}
}

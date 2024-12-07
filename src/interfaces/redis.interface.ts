export interface IRedisRecord<T = string> {
  key: string;
  value: T;
}

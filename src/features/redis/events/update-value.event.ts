export class UpdateCacheValueEvent {
  constructor(
    public key: string,
    public value: Partial<{ [key: string]: string | number | boolean }>,
  ) {}
}

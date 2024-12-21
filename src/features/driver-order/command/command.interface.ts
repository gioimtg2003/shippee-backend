export interface IDataCommandDriverOrder {
  idDriver: number;
  idOrder: number;
  imgDelivered?: string;
}

export interface CommandDriverOrder {
  execute(data: IDataCommandDriverOrder): void;
}

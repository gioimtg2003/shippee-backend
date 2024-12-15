export interface IDataCommandDriverOrder {
  idDriver: number;
  idOrder: number;
}

export interface CommandDriverOrder {
  execute(data: IDataCommandDriverOrder): void;
}

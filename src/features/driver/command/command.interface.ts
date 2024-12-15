export interface IDataCommandDriver {
  idDriver: number;
  lat?: number;
  lng?: number;
}

export interface CommandDriver {
  execute(data: IDataCommandDriver): void;
}

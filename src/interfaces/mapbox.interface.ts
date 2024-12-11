interface IWaypoint {
  distance: number;
  name: string;
  location: [number, number];
}

interface IRoute {
  weight_name: string;
  weight: number;
  duration: number;
  distance: number;
  legs: [];
  geometry: {
    coordinates: [number, number][];
    type: string;
  };
}

export interface IDirectionMapBox {
  routes: IRoute[];
  waypoints: [IWaypoint, IWaypoint];
  code: string;
  uuid: string;
}

import type { LatLng } from '$types/client';

export interface ClientBorough {
  id: number;
  name: string;
  color: string;
  neighborhoods: Neighborhood[];
  runs: string[];
  center: LatLng;
}

export interface RawBorough {
  id: number;
  name: string;
  color: string;
  nIds: number[];
  center: LatLng;
}

export interface Neighborhood {
  id: number;
  name: string;
  parent: number;
  color: string;
  runs: string[];
}

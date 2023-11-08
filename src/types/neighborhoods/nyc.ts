import type { Position } from 'geojson';

export interface ClientBorough {
  id: number;
  name: string;
  color: string;
  neighborhoods: Neighborhood[];
  runs: string[];
  center: Position;
}

export interface RawBorough {
  id: number;
  name: string;
  color: string;
  nIds: number[];
  center: Position;
}

export interface Neighborhood {
  id: number;
  name: string;
  parent: number;
  color: string;
  runs: string[];
}

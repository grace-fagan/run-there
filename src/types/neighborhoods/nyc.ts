import type { Position } from 'geojson';

export interface Region {
  id: number;
  name: string;
  color: string;
  neighborhoods: Neighborhood[];
  runs: string[];
  center: Position;
}

export interface Neighborhood {
  id: number;
  name: string;
  parent: number;
  color: string;
  runs: string[];
}

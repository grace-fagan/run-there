export interface ClientBorough {
  id: number;
  name: string;
  color: string;
  neighborhoods: Neighborhood[];
  runs: string[];
}

export interface RawBorough {
  id: number;
  name: string;
  color: string;
  nIds: number[];
}

export interface Neighborhood {
  id: number;
  name: string;
  borough: number;
  color: string;
  runs: string[];
}

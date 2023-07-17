export interface Borough {
  name: string;
  color: string;
}

export interface NeighborhoodProperties {
  id: number;
  name: string;
  borough: number;
  color: string;
  neighbors: number[];
  runs: string[];
  value: number;
}

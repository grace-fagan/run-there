export interface Borough {
  name: string;
  color: string;
}

export interface NYCNeighborhood {
  id: number;
  name: string;
  borough: Borough;
  neighbors: number[];
}

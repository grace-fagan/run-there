import type { Neighborhood, Region } from '$types/neighborhoods/nyc';
import type { Feature } from 'geojson';

export const featureToNeighborhood = (n: Feature): Neighborhood => {
  const id = n.id as number;
  const { name, parent, color, runs } = n.properties;
  const cleanedRuns = typeof runs === 'string' ? JSON.parse(runs) : runs;
  return { id, name, parent, color, runs: cleanedRuns };
};

export const regionMap = new Map<number, Region>([
  [
    1,
    {
      id: 1,
      name: 'Manhattan',
      color: '#76B5C3',
      center: [-73.976983, 40.78091],
      neighborhoods: [],
      runs: []
    }
  ],
  [
    2,
    {
      id: 2,
      name: 'Bronx',
      color: '#E6A156',
      center: [-73.841141, 40.851717],
      neighborhoods: [],
      runs: []
    }
  ],
  [
    3,
    {
      id: 3,
      name: 'Brooklyn',
      color: '#E6BC42',
      center: [-73.961849, 40.655478],
      neighborhoods: [],
      runs: []
    }
  ],
  [
    4,
    {
      id: 4,
      name: 'Queens',
      color: '#E04051',
      center: [-73.826527, 40.715127],
      neighborhoods: [],
      runs: []
    }
  ],
  [
    5,
    {
      id: 5,
      name: 'Staten Island',
      color: '#63BC83',
      center: [-74.146728, 40.564099],
      neighborhoods: [],
      runs: []
    }
  ]
]);

export const getRegion = (key: number) => regionMap.get(key);

import type { Neighborhood, RawBorough } from '$types/neighborhoods/nyc';
import NYCData from '$data/neighborhoods/NYC.json';
import type { Feature } from 'geojson';

export const featureToNeighborhood = (n: Feature): Neighborhood => {
  const { id, name, borough, color, runs } = n.properties;
  const cleanedRuns = typeof runs === 'string' ? JSON.parse(runs) : runs;
  return { id, name, parent: borough, color, runs: cleanedRuns };
};

const getNeighborhoodIdsFromBorough = (b: number): number[] => {
  return NYCData.features.filter((f) => Number(f.properties.boroughCode) === b).map((f) => f.id);
};

export const NYC_CENTER = [-73.95473, 40.67232];
export const boroughMap = new Map<number, RawBorough>([
  [
    1,
    {
      id: 1,
      name: 'Manhattan',
      color: '#76B5C3',
      nIds: getNeighborhoodIdsFromBorough(1),
      center: [-73.976983, 40.78091]
    }
  ],
  [
    2,
    {
      id: 2,
      name: 'Bronx',
      color: '#E6A156',
      nIds: getNeighborhoodIdsFromBorough(2),
      center: [-73.841141, 40.851717]
    }
  ],
  [
    3,
    {
      id: 3,
      name: 'Brooklyn',
      color: '#E6BC42',
      nIds: getNeighborhoodIdsFromBorough(3),
      center: [-73.961849, 40.655478]
    }
  ],
  [
    4,
    {
      id: 4,
      name: 'Queens',
      color: '#E04051',
      nIds: getNeighborhoodIdsFromBorough(4),
      center: [-73.826527, 40.715127]
    }
  ],
  [
    5,
    {
      id: 5,
      name: 'Staten Island',
      color: '#63BC83',
      nIds: getNeighborhoodIdsFromBorough(5),
      center: [-74.146728, 40.564099]
    }
  ]
]);

export const CodeToBorough = (code: number) => boroughMap.get(code);

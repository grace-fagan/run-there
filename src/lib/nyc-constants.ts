import type { CityBounds, LatLng } from '$types/client';
import type { Neighborhood, RawBorough } from '$types/neighborhoods/nyc';
import NYCData from '$data/NYC.json';
import type { Feature } from 'geojson';

export const featureToNeighborhood = (n: Feature): Neighborhood => {
  const { id, name, borough, color, runs } = n.properties;
  const cleanedRuns = typeof runs === 'string' ? JSON.parse(runs) : runs;
  return { id, name, borough, color, runs: cleanedRuns };
};

const getNeighborhoodIdsFromBorough = (b: number): number[] => {
  return NYCData.features.filter((f) => Number(f.properties.boroughCode) === b).map((f) => f.id);
};

export const NYC_BOUNDS: CityBounds = {
  minLat: 40.5,
  minLng: -74.25,
  maxLat: 40.92,
  maxLng: -73.68
};

export const NYC_CENTER: LatLng = {
  lat: 40.67232,
  lng: -73.95473
};

export const boroughMap = new Map<number, RawBorough>([
  [1, { id: 1, name: 'Manhattan', color: '#76B5C3', nIds: getNeighborhoodIdsFromBorough(1) }],
  [2, { id: 2, name: 'Bronx', color: '#E6A156', nIds: getNeighborhoodIdsFromBorough(2) }],
  [3, { id: 3, name: 'Brooklyn', color: '#E6BC42', nIds: getNeighborhoodIdsFromBorough(3) }],
  [4, { id: 4, name: 'Queens', color: '#E04051', nIds: getNeighborhoodIdsFromBorough(4) }],
  [5, { id: 5, name: 'Staten Island', color: '#63BC83', nIds: getNeighborhoodIdsFromBorough(5) }]
]);

export const CodeToBorough = (code: number) => boroughMap.get(code);

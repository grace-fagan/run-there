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
  [
    1,
    {
      id: 1,
      name: 'Manhattan',
      color: '#76B5C3',
      nIds: getNeighborhoodIdsFromBorough(1),
      center: { lng: -73.976983, lat: 40.78091 }
    }
  ],
  [
    2,
    {
      id: 2,
      name: 'Bronx',
      color: '#E6A156',
      nIds: getNeighborhoodIdsFromBorough(2),
      center: { lng: -73.841141, lat: 40.851717 }
    }
  ],
  [
    3,
    {
      id: 3,
      name: 'Brooklyn',
      color: '#E6BC42',
      nIds: getNeighborhoodIdsFromBorough(3),
      center: { lng: -73.961849, lat: 40.655478 }
    }
  ],
  [
    4,
    {
      id: 4,
      name: 'Queens',
      color: '#E04051',
      nIds: getNeighborhoodIdsFromBorough(4),
      center: { lng: -73.826527, lat: 40.715127 }
    }
  ],
  [
    5,
    {
      id: 5,
      name: 'Staten Island',
      color: '#63BC83',
      nIds: getNeighborhoodIdsFromBorough(5),
      center: { lng: -74.146728, lat: 40.564099 }
    }
  ]
]);

export const CodeToBorough = (code: number) => boroughMap.get(code);

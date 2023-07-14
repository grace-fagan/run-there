import type { CityBounds, LatLng } from '$types/client';
import type { Borough } from '$types/neighborhoods/nyc';

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

const boroughMap = new Map<number, Borough>([
  [1, { name: 'Manhattan', color: 'blue' }],
  [2, { name: 'Bronx', color: 'orange' }],
  [3, { name: 'Brooklyn', color: 'yellow' }],
  [4, { name: 'Queens', color: 'red' }],
  [5, { name: 'Staten Island', color: 'green' }]
]);

export const CodeToBorough = (code: number) => boroughMap.get(code);

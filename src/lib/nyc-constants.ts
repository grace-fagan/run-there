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
  [1, { name: 'Manhattan', color: '#76B5C3' }],
  [2, { name: 'Bronx', color: '#E6A156' }],
  [3, { name: 'Brooklyn', color: '#E6BC42' }],
  [4, { name: 'Queens', color: '#E04051' }],
  [5, { name: 'Staten Island', color: '#63BC83' }]
]);

export const CodeToBorough = (code: number) => boroughMap.get(code);

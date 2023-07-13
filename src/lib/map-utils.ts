import type { CityBounds } from '$types/client';
import polyline from '@mapbox/polyline';
import type { LineString } from 'geojson';

export const NYC_BOUNDS: CityBounds = {
  minLat: 40.5,
  minLng: -74.25,
  maxLat: 40.92,
  maxLng: -73.68
};

// TO-DO: add ts support for geoJSON
export const getPolyline = (summary: string): LineString => polyline.toGeoJSON(summary);

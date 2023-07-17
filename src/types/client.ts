import type { ActivityType } from './stravaAPI';
import type { LineString } from 'geojson';

export interface UserAuth {
  id: string;
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
}

export interface LatLng {
  lat: number;
  lng: number;
}

//To-DO: move summaryPolyline to Route object
export interface Activity {
  id: string;
  name: string;
  distance: number;
  summaryPolyline: string;
  sport: ActivityType;
  startDate: Date;
  startLatLng: LatLng;
}

export interface Route {
  id: string;
  lineString: LineString;
  neighborhoods: number[];
}

export interface CityBounds {
  minLng: number;
  minLat: number;
  maxLng: number;
  maxLat: number;
}

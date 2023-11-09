import type { ActivityType } from './stravaAPI';
import type { LineString, Position } from 'geojson';

export interface UserAuth {
  id: string;
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
}

//To-DO: move summaryPolyline to Route object
export interface Activity {
  id: string;
  name: string;
  distance: number;
  summaryPolyline: string;
  sport: ActivityType;
  startDate: Date;
  startLatLng: Position;
}

export interface Route {
  id: string;
  lineString: LineString;
  neighborhoods: number[];
}

export interface City {
  display: string;
  center: Position;
  secondary?: string;
}

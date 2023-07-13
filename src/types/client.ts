import type { ActivityType } from './stravaAPI';

export interface UserAuth {
  id: string;
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
}

export interface ClientActivity {
  id: number;
  name: string;
  distance: number;
  summaryPolyline: string;
  sport: ActivityType;
  startDate: Date;
  startLatLng: number[];
}

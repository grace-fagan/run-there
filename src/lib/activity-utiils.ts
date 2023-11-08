import type { Activity } from '$types/client';
import { ActivityType } from '$types/stravaAPI/activity-type';
import type { StravaSummaryActivity } from '$types/stravaAPI/summary-activity';
import booleanPointInPolygon from '@turf/boolean-point-in-polygon';
import type { MultiPolygon, Polygon } from 'geojson';

export const cleanActivities = (stravaActivities: StravaSummaryActivity[]): Activity[] => {
  return stravaActivities.map((a) => {
    return {
      id: a.id.toString(),
      name: a.name as string,
      distance: a.distance as number,
      summaryPolyline: a.map.summary_polyline as string,
      sport: a.type as ActivityType,
      startDate: a.start_date as Date,
      // Strava gives us a [lat, lng], we are using [lng, lat]
      startLatLng: a.start_latlng.reverse()
    };
  });
};

export const filterByCity = (activities: Activity[], city: MultiPolygon | Polygon): Activity[] => {
  return activities?.filter((f) => {
    return (
      f.sport === ActivityType.Run &&
      f.summaryPolyline &&
      booleanPointInPolygon(f.startLatLng, city)
    );
  });
};

export const formatDate = (dateToFormat: Date) => {
  const date = new Date(dateToFormat);
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const year = date.getFullYear();
  let hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, '0');

  const ampm = hours >= 12 ? 'PM' : 'AM';
  // Convert to 12-hour format
  hours = hours % 12;
  hours = hours ? hours : 12;

  return `${month}/${day}/${year} ${hours}:${minutes} ${ampm}`;
};

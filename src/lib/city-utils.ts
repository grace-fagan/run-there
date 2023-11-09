import type { Activity, City } from '$types/client';
import { ActivityType } from '$types/stravaAPI/activity-type';
import booleanPointInPolygon from '@turf/boolean-point-in-polygon';
import type { MultiPolygon } from '@turf/helpers';
import type { Polygon } from 'geojson';

export const filterByCity = (activities: Activity[], city: MultiPolygon | Polygon): Activity[] => {
  console.log({ activities });
  return activities?.filter((f) => {
    return (
      f.sport === ActivityType.Run &&
      f.summaryPolyline &&
      booleanPointInPolygon(f.startLatLng, city)
    );
  });
};

export const cityInfo: Record<string, City> = {
  nyc: {
    display: 'NYC',
    center: [-73.95473, 40.67232],
    secondary: 'borough'
  },
  sea: {
    display: 'SEA',
    center: [-122.3320708, 47.6062095]
  },
  chi: {
    display: 'CHI',
    center: [-87.6297982, 41.8781136]
  }
};

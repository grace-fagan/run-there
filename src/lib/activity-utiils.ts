import type { CityBounds, Activity, LatLng } from '$types/client';
import type { ActivityType } from '$types/stravaAPI/activity-type';
import type { StravaSummaryActivity } from '$types/stravaAPI/summary-activity';

export const cleanActivities = (stravaActivities: StravaSummaryActivity[]): Activity[] => {
  return stravaActivities.map((a) => {
    return {
      id: a.id.toString(),
      name: a.name as string,
      distance: a.distance as number,
      summaryPolyline: a.map.summary_polyline as string,
      sport: a.type as ActivityType,
      startDate: a.start_date as Date,
      startLatLng: {
        lat: a.start_latlng[0],
        lng: a.start_latlng[1]
      } as LatLng
    };
  });
};

const insideCityBounds = (point: LatLng, box: CityBounds): boolean => {
  const { lat, lng } = point;
  const { minLat, minLng, maxLat, maxLng } = box;
  return lat && lng && lat > minLat && lat < maxLat && lng < maxLng && lng > minLng;
};

export const filterByCity = (activities: Activity[], city: CityBounds): Activity[] => {
  return activities.filter((f) => f.summaryPolyline && insideCityBounds(f.startLatLng, city));
};

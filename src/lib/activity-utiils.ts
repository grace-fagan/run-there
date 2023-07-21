import type { CityBounds, Activity, LatLng } from '$types/client';
import { ActivityType } from '$types/stravaAPI/activity-type';
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
  return activities.filter((f) => {
    return (
      f.sport === ActivityType.Run && f.summaryPolyline && insideCityBounds(f.startLatLng, city)
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

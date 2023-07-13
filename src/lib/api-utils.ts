import type { ClientActivity } from '$types/client';
import type { StravaSummaryActivity } from '$types/stravaAPI';

export const cleanActivities = (stravaActivities: StravaSummaryActivity[]): ClientActivity[] => {
  return stravaActivities.map((a) => {
    return {
      id: a.id as number,
      name: a.name as string,
      distance: a.distance as number,
      summaryPolyline: a.map.summary_polyline as string,
      sport: a.type,
      startDate: a.start_date,
      startLatLng: a.start_latlng
    };
  });
};

export const getServerUrl = (env: ImportMetaEnv): string => {
  if (!env.MODE || !env.VITE_DEV_SERVER || !env.VITE_PROD_SERVER)
    throw new Error(`env missing properties for server url`);
  const url = window.location.href;
  if (url.includes('localhost')) return env.VITE_DEV_SERVER;
  else return env.VITE_PROD_SERVER;
};

//code taken and modified from Bluebird package and Victor Quinn: https://gist.github.com/victorquinn/8030190
//see explanation: https://www.victorquinn.com/javascript-promise-while-loop
export const promiseWhile = async (condition: () => boolean, action: () => Promise<void>) => {
  function loop() {
    if (condition()) return;
    return Promise.resolve(action()).then(loop);
  }
  // const result = await Promise.resolve();
  return loop();
};

import type { StravaSummaryActivity } from '$types/stravaAPI/summary-activity';
import { type Writable } from 'svelte/store';
import { getServerUrl } from './utils/env';

const baseURL = getServerUrl(import.meta.env);

//code taken and modified from Bluebird package and Victor Quinn: https://gist.github.com/victorquinn/8030190
//see explanation: https://www.victorquinn.com/javascript-promise-while-loop
const promiseWhile = async (condition: () => boolean, action: () => Promise<void>) => {
  function loop() {
    if (condition()) return;
    return Promise.resolve(action()).then(loop);
  }
  return loop();
};

export const getUserAuth = async (token: string, grantType: string, athleteId?: string) => {
  return fetch(
    `${baseURL}/.netlify/functions/getUserAuth?token=${token}&grant_type=${grantType}&athleteId=${athleteId}`
  ).then(async (r) => {
    if (!r.ok) {
      const error = await r.json();
      throw new Error(error.message);
    }
    return r.json();
  });
};

export const getUserActivities = async (accessToken: string, startPage: number, after?: number) => {
  return fetch(
    `${baseURL}/.netlify/functions/getUserData?token=${accessToken}&pageNum=${startPage}&after=${after}`
  ).then(async (r) => {
    if (!r.ok) {
      const error = await r.json();
      throw new Error(error.message);
    }
    return r.json();
  });
};

export const getBatchActivities = async (
  accessToken: string,
  totalFetched: Writable<number>,
  after?: number
) => {
  let page = 1;
  let currActivities: StravaSummaryActivity[] = [];
  let totalFetchedActivities: StravaSummaryActivity[] = [];

  const isNullPage = () => currActivities.length === 0 && page > 1;

  const getPage = async () => {
    console.log('getting page: ', page);
    currActivities = await getUserActivities(accessToken, page, after);
    totalFetchedActivities = totalFetchedActivities.concat(currActivities);
    totalFetched.update(() => totalFetchedActivities.length);
    page++;
  };

  // can only retrieve one page at a time due to Netlify's 10 second max runtime for serverless functions
  return promiseWhile(isNullPage, getPage).then(() => totalFetchedActivities);
};

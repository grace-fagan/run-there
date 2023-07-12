import { getServerUrl } from './server-utils';

const baseURL = getServerUrl(import.meta.env);

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

export const getUserActivities = async (accessToken: string, startPage: number) => {
  return fetch(
    `${baseURL}/.netlify/functions/getUserData?token=${accessToken}&pageNum=${startPage}`
  ).then(async (r) => {
    if (!r.ok) {
      const error = await r.json();
      throw new Error(error.message);
    }
    return r.json();
  });
};

import { getServerUrl } from './server-utils';

const baseURL = getServerUrl(import.meta.env);

export const getUserAuth = async (authToken: string) => {
  return fetch(`${baseURL}/.netlify/functions/getUserAuth?authTok=${authToken}`).then((r) =>
    r.json()
  );
};

export const getUserActivities = async (accessToken: string, startPage: number) => {
  return fetch(
    `${baseURL}/.netlify/functions/getUserData?token=${accessToken}&pageNum=${startPage}`
  ).then((r) => r.json());
};

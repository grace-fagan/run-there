import type { Activity, UserAuth } from '$types/client';
import { getUserAuth } from './api';

const clientID = import.meta.env.VITE_CLIENT_ID;
const redirectURL = `${window.location.origin}/redirect`;

export const scope = 'read,activity:read_all,profile:read_all';
export const authURL = `http://www.strava.com/oauth/authorize?client_id=${clientID}&response_type=code&redirect_uri=${redirectURL}/exchange_token&approval_prompt=force&scope=${scope}`;

export const getLocalAuth = (): UserAuth => {
  const authString = localStorage.getItem('userAuth');
  return JSON.parse(authString);
};

export const getLocalActivities = (id: string) => {
  const activitiesString = localStorage.getItem(`activities-${id}`);
  return JSON.parse(activitiesString);
};

export const updateLocalActivities = (id: string, activities: Activity[]) => {
  localStorage.setItem(`activities-${id}`, JSON.stringify(activities));
};

export const getValidAuth = async (authCode?: string) => {
  const localAuth = getLocalAuth();
  const now = new Date().getTime();
  let newAuth: UserAuth;
  try {
    if (!localAuth) {
      if (!authCode) window.location.replace(authURL);
      newAuth = await getUserAuth(authCode, 'authorization_code');
      // if user exists but access token has expired (convert seconds to milliseconds)
    } else if (localAuth.expiresAt * 1000 < now) {
      console.log('access code expired! Getting a new one...');
      newAuth = await getUserAuth(localAuth.refreshToken, 'refresh_token');
    } else newAuth = localAuth;
  } catch (error) {
    throw new Error(error.message);
  }
  return newAuth;
};

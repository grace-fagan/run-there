import type { UserAuth } from '$types/client';

const clientID = import.meta.env.VITE_CLIENT_ID;
const redirectURL = `${window.location}redirect`;

export const scope = 'read,activity:read_all,profile:read_all';
export const authURL = `http://www.strava.com/oauth/authorize?client_id=${clientID}&response_type=code&redirect_uri=${redirectURL}/exchange_token&approval_prompt=force&scope=${scope}`;

export const getLocalAuth = (): UserAuth => {
  const authString = localStorage.getItem('userAuth');
  return JSON.parse(authString);
};

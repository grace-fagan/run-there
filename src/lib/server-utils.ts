const clientID = import.meta.env.VITE_CLIENT_ID;
const redirectURL = `${window.location}redirect`;

export const scope = 'read,activity:read_all,profile:read_all';
export const authURL = `http://www.strava.com/oauth/authorize?client_id=${clientID}&response_type=code&redirect_uri=${redirectURL}/exchange_token&approval_prompt=force&scope=${scope}`;

export interface UserAuth {
  id: string;
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
}

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

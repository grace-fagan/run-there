const clientID = import.meta.env.VITE_CLIENT_ID;
const redirectURL = `${window.location}redirect`;

console.log({clientID})

const scope = "read,activity:read_all,profile:read_all";
export const authURL = `http://www.strava.com/oauth/authorize?client_id=${clientID}&response_type=code&redirect_uri=${redirectURL}/exchange_token&approval_prompt=force&scope=${scope}`;
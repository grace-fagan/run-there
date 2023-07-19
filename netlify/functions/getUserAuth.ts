import type { Handler, HandlerEvent } from '@netlify/functions';
import axios from 'axios';
import { handleNetworkError } from '$lib/error';

const clientID = process.env.VITE_CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;

export enum GrantType {
  AUTH_CODE = 'authorization_code',
  REFRESH = 'refresh_token'
}

const getUserAccessFromGrantType = async (token: string, grantType: string) => {
  let tokenString = '';
  if (grantType === GrantType.REFRESH) tokenString = `refresh_token=${token}`;
  else if (grantType === GrantType.AUTH_CODE) tokenString = `code=${token}`;
  const response = await axios.post(
    `https://www.strava.com/api/v3/oauth/token?client_id=${clientID}&client_secret=${clientSecret}&grant_type=${grantType}&${tokenString}`
  );
  return response;
};

const handler: Handler = async (event: HandlerEvent) => {
  const queryParams = event.queryStringParameters;

  try {
    if (!queryParams) throw new Error('missing parameters');
    const token = queryParams.token;
    const grantType = queryParams.grant_type;
    // optional parameter passed if athlete id already exists
    const athleteId = queryParams.id;
    if (!token || !grantType) throw new Error('missing parameters');

    const validGrantType = Object.values(GrantType).includes(grantType as GrantType);
    if (!validGrantType) throw new Error('invalid grant type');

    // get refresh token and access token using the authorization code or refresh token
    const userAccess = await getUserAccessFromGrantType(token, grantType);
    if (!userAccess.data) throw new Error('invalid user data');
    const { athlete, access_token, expires_at, refresh_token } = userAccess.data;
    return {
      statusCode: 200,
      body: JSON.stringify({
        id: athleteId || (athlete && athlete.id),
        accessToken: access_token,
        expiresAt: expires_at,
        refreshToken: refresh_token
      }),
      headers: {
        'Access-Control-Allow-Origin': '*'
      }
    };
  } catch (error) {
    console.error(error);
    const errorMsg = handleNetworkError(error);
    return {
      statusCode: 400,
      body: JSON.stringify({ message: `Could not authorize user: ${errorMsg}` }),
      headers: {
        'Access-Control-Allow-Origin': '*'
      }
    };
  }
};

export { handler };

import type { Handler, HandlerEvent, HandlerContext } from '@netlify/functions';
import axios from 'axios';

const clientID = process.env.VITE_CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;

const handler: Handler = async (event: HandlerEvent, context: HandlerContext) => {
  const authToken = event.queryStringParameters?.authTok || '';

  // get refresh token and access token using the authorization code
  const userAccess = await getUserAccess(authToken);
  const accessToken = userAccess.access_token;

  return {
    statusCode: 200,
    body: JSON.stringify({
      userAccess: userAccess,
      accessToken: accessToken
    }),
    headers: {
      'access-control-allow-origin': '*'
    }
  };
};

const getUserAccess = async (authToken: string) => {
  try {
    const response = await axios.post(
      `https://www.strava.com/api/v3/oauth/token?client_id=${clientID}&client_secret=${clientSecret}&code=${authToken}&grant_type=authorization_code`
    );
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

export { handler };

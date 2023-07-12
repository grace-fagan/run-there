import type { Handler, HandlerEvent, HandlerContext } from '@netlify/functions';
import axios from 'axios';

const getUserDataByPage = async (accessToken: string, page: number) => {
  const response = await axios.get(
    `https://www.strava.com/api/v3/athlete/activities?per_page=200&page=${page}`,
    { headers: { Authorization: `Bearer ${accessToken}` } }
  );
  return response;
};

const handler: Handler = async (event: HandlerEvent, context: HandlerContext) => {
  const accessToken = event.queryStringParameters?.token || '';
  const pageNum = Number(event.queryStringParameters?.pageNum) || 0;

  let activities = [];
  const activityPage = await getUserDataByPage(accessToken, pageNum);

  if (activityPage.data) {
    console.log('getting activities for page ', pageNum, 'there are ', activityPage.data.length);
    if (activityPage.data.length !== 0) activities = activities.concat(activityPage.data);
  }

  return {
    statusCode: 200,
    body: JSON.stringify({
      userActivities: activities
    }),
    headers: {
      'access-control-allow-origin': '*'
    }
  };
};

export { handler };

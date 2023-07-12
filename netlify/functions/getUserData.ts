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
  const queryParams = event.queryStringParameters;

  try {
    if (!queryParams) throw new Error('missing request parameters');

    const accessToken = queryParams.token || '';
    const pageNum = queryParams.pageNum;

    if (!accessToken || !pageNum) throw new Error('missing request parameters');

    let activities = [];
    const activityPage = await getUserDataByPage(accessToken, Number(pageNum));
    if (!activityPage.data) throw new Error('invalid activity data');

    console.log('getting activities for page ', pageNum, 'there are ', activityPage.data.length);
    if (activityPage.data.length !== 0) activities = activities.concat(activityPage.data);

    return {
      statusCode: 200,
      body: JSON.stringify(activities),
      headers: {
        'Access-Control-Allow-Origin': '*'
      }
    };
  } catch (error) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: `Could not authorize user: ${error}` }),
      headers: {
        'Access-Control-Allow-Origin': '*'
      }
    };
  }
};

export { handler };

<script lang="ts">
  import { authURL, getLocalActivities, getLocalAuth, scope } from '$lib/auth-utils';
  import type { UserAuth } from '$types/client';
  import { getUserAuth, getUserActivities } from '$lib/api';
  import { onMount } from 'svelte';
  import { navigate } from 'svelte-routing';
  import type { StravaSummaryActivity } from '$types/stravaAPI';
  import { promiseWhile } from '$lib/api-utils';
  import { activities } from '$lib/store';
  import { cleanActivities } from '$lib/activity-utiils';

  const queryParams = new URLSearchParams(window.location.search);
  const authedScope = queryParams.get('scope');
  const stravaAuthCode = queryParams.get('code');

  let accessToken = '';
  let athleteId = '';

  let error = '';
  let fetchingActivities = false;
  let totalFetchedActivites: StravaSummaryActivity[] = [];

  const fetchAllActivities = async (accessToken: string) => {
    let page = 1;
    let currActivities: StravaSummaryActivity[] = [];

    const isNullPage = () => currActivities.length === 0 && page > 1;

    const getPage = async () => {
      console.log('getting page: ', page);
      currActivities = await getUserActivities(accessToken, page);
      console.log({ currActivities });
      totalFetchedActivites = totalFetchedActivites.concat(currActivities);
      page++;
    };

    // can only retrieve one page at a time due to Netlify's 10 second max runtime for serverless functions
    return promiseWhile(isNullPage, getPage).then(() => {
      console.log('finished fetching data!', { totalFetchedActivites });
      const cleanedActivities = cleanActivities(totalFetchedActivites);
      $activities = cleanedActivities;
      return cleanedActivities;
    });
  };

  // authenticate user
  onMount(async () => {
    // if single use auth code has already been used, redirect to home page
    if (stravaAuthCode === localStorage.getItem('singleUseCode')) {
      navigate('/');
      return;
    } else localStorage.setItem('singleUseCode', stravaAuthCode);

    const validScope = authedScope === scope;
    const localAuth = getLocalAuth();
    const now = new Date().getTime();
    let newAuth: UserAuth = null;

    if (!validScope) {
      error = 'Oh no! You must allow the app to view your data to continue';
    } else {
      try {
        if (!localAuth) {
          newAuth = await getUserAuth(stravaAuthCode, 'authorization_code');
          // if user exists but access token has expired (convert seconds to milliseconds)
        } else if (localAuth.expiresAt * 1000 < now) {
          console.log('access code expired! Getting a new one...');
          newAuth = await getUserAuth(localAuth.refreshToken, 'refresh_token');
        } else newAuth = localAuth;
      } catch (error) {
        // TO-DO: error handling
        console.error(error);
      }

      // TO-DO: support multiple users
      if (newAuth) {
        accessToken = newAuth.accessToken;
        athleteId = newAuth.id;
        console.log('setting to local storage: ', newAuth);
        localStorage.setItem('userAuth', JSON.stringify(newAuth));
      }

      // fetch activity data
      const localActivities = getLocalActivities(athleteId);
      if (accessToken && !localActivities) {
        try {
          fetchingActivities = true;
          const newActivities = await fetchAllActivities(accessToken);
          if (!newActivities) throw new Error('No activity data found.');
          localStorage.setItem(`activities-${athleteId}`, JSON.stringify(newActivities));
        } catch (error) {
          //TO-DO: error handling
          console.error(error);
        } finally {
          fetchingActivities = false;
        }
      } else if (accessToken) {
        console.log('activities already found!');
        $activities = localActivities;
      }

      // navigate to cities page
      console.log({ $activities });
      navigate('/nyc');
    }
  });
</script>

<main class="flex flex-col gap-2 items-center">
  {#if error}
    <p>{error}</p>
    <button
      class="p-2 border border-gray-300 rounded-md hover:scale-105 transition-all"
      on:click={() => window.location.replace(authURL)}>Go back</button
    >
  {/if}
  {#if fetchingActivities}
    <p>Fetching activities...</p>
    <p>there are {totalFetchedActivites.length}</p>
  {/if}
</main>

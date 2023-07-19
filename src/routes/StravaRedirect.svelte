<script lang="ts">
  import { authURL, getLocalActivities, getLocalAuth, scope } from '$lib/auth-utils';
  import type { UserAuth } from '$types/client';
  import { getUserAuth, getBatchActivities } from '$lib/api';
  import { onMount } from 'svelte';
  import { navigate } from 'svelte-routing';
  import { activities } from '$lib/store';
  import { cleanActivities } from '$lib/activity-utiils';
  import { writable } from 'svelte/store';

  const queryParams = new URLSearchParams(window.location.search);
  const authedScope = queryParams.get('scope');
  const stravaAuthCode = queryParams.get('code');

  let accessToken = '';
  let athleteId = '';

  let error = '';
  let fetchingActivities = false;
  const totalActivitiesFetched = writable(0);

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
          const rawActivities = await getBatchActivities(accessToken, totalActivitiesFetched);
          if (!rawActivities) throw new Error('No activity data found.');
          const cleanedActivities = cleanActivities(rawActivities);
          $activities = cleanedActivities;
          localStorage.setItem(`activities-${athleteId}`, JSON.stringify(cleanedActivities));
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
    <p>there are {$totalActivitiesFetched}</p>
  {/if}
</main>

<script lang="ts">
  import {
    authURL,
    getLocalActivities,
    getValidAuth,
    scope,
    updateLocalActivities
  } from '$lib/auth-utils';
  import { getBatchActivities } from '$lib/api';
  import { onMount } from 'svelte';
  import { navigate } from 'svelte-routing';
  import { activities } from '$lib/store';
  import { cleanActivities } from '$lib/activity-utiils';
  import { writable } from 'svelte/store';
  import type { UserAuth } from '$types/client';

  const queryParams = new URLSearchParams(window.location.search);
  const authedScope = queryParams.get('scope');
  const stravaAuthCode = queryParams.get('code');

  let accessToken = '';
  let athleteId = '';
  let userAuth: UserAuth;

  let errorMsg = '';
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

    try {
      userAuth = await getValidAuth(stravaAuthCode);
    } catch (error) {
      errorMsg = error.message;
    }

    if (!validScope) {
      errorMsg = 'Oh no! You must allow the app to view your data to continue';
    } else if (userAuth) {
      // TO-DO: support multiple users
      accessToken = userAuth.accessToken;
      athleteId = userAuth.id;
      console.log('setting to local storage: ', userAuth);
      localStorage.setItem('userAuth', JSON.stringify(userAuth));

      // fetch activity data
      const localActivities = getLocalActivities(athleteId);
      if (accessToken && !localActivities) {
        try {
          fetchingActivities = true;
          const rawActivities = await getBatchActivities(accessToken, totalActivitiesFetched);
          if (!rawActivities) throw new Error('No activity data found.');
          const cleanedActivities = cleanActivities(rawActivities);
          $activities = cleanedActivities;
          updateLocalActivities(athleteId, cleanedActivities);
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
  <div class="flex flex-col gap-2 h-screen justify-center items-center">
    {#if errorMsg}
      <p class="error">{errorMsg}</p>
      <div class="flex">
        <button
          class="p-2 border border-gray-300 rounded-md hover:scale-105 transition-all"
          on:click={() => window.location.replace(authURL)}>Go back</button
        >
      </div>
    {/if}
    {#if fetchingActivities}
      <p>Fetching activities...</p>
      <p>there are {$totalActivitiesFetched}</p>
    {/if}
  </div>
</main>

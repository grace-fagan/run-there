<script lang="ts">
  import { activities } from '$lib/store';
  import { cleanActivities, formatDate } from '$lib/activity-utiils';
  import { getBatchActivities } from '$lib/api';
  import { getLocalAuth } from '$lib/auth-utils';
  import { writable } from 'svelte/store';
  import type { Activity } from '$types/client';

  const totalFetched = writable(0);

  let fetching = false;
  let errorMsg = '';
  let mostRecent: Activity = null;
  let timeAfter: number = null;

  $: if ($activities.length > 0) {
    mostRecent = $activities[$activities.length - 1];
    timeAfter = mostRecent && new Date(mostRecent.startDate).getTime() / 1000;
  }

  const refreshActivities = async () => {
    fetching = true;

    const auth = getLocalAuth();
    // TO-DO: check if access token is expired
    const accessToken = auth.accessToken;

    try {
      const rawActivities = await getBatchActivities(accessToken, totalFetched, timeAfter);
      if (!rawActivities || rawActivities.length === 0) errorMsg = 'No new activities';
      const newActivities = cleanActivities(rawActivities);
      console.log({ newActivities });
      newActivities.forEach((newA) => {
        if (!$activities.find((a) => a.id === newA.id)) {
          console.log('adding a new activity');
          $activities.push(newA);
          $activities = $activities;
        }
      });
    } catch (error) {
      errorMsg = error;
    } finally {
      fetching = false;
    }
  };
</script>

<div class="flex flex-col gap-2">
  {#if errorMsg}
    <p class="text-xs error">{errorMsg}</p>
  {/if}
  <div class="flex gap-2 items-center cursor-pointer" on:pointerdown={refreshActivities}>
    <i
      class={`fa-solid fa-rotate-right hover:scale-110 transition-all text-black ${
        fetching ? 'fa-spin' : ''
      }`}
    />
    <p>{fetching ? 'Refreshing...' : 'Refresh activities'}</p>
  </div>
  {#if mostRecent}
    <p>Latest activity: {formatDate(mostRecent.startDate)}</p>
  {/if}
</div>

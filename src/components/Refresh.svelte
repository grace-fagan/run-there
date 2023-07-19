<script lang="ts">
  import { activities } from '$lib/store';
  import { cleanActivities, formatDate } from '$lib/activity-utiils';
  import { getBatchActivities } from '$lib/api';
  import { getLocalAuth } from '$lib/auth-utils';
  import type { Activity } from '$types/client';
  import { writable } from 'svelte/store';

  // const totalFetched = writable(0);

  let fetching = false;
  let errorMsg = '';
  $: mostRecent = $activities[$activities.length - 1];
  $: timeAfter = new Date(mostRecent.startDate).getTime() / 1000;

  const refreshActivities = async (activities: Activity[]) => {
    fetching = true;
    console.log(activities);

    // const auth = getLocalAuth();
    // // TO-DO: check if access token is expired
    // const accessToken = auth.accessToken;

    // try {
    //   const rawActivities = await getBatchActivities(accessToken, totalFetched, timeAfter);
    //   if (!rawActivities || rawActivities.length === 0) errorMsg = 'No new activities';
    //   const newActivities = cleanActivities(rawActivities);
    //   console.log({ newActivities });
    //   newActivities.forEach((newA) => {
    //     if (!$activities.find((a) => a.id === newA.id)) {
    //       console.log('adding new activity');
    //       $activities.push(newA);
    //       $activities = $activities;
    //     }
    //   });
    // } catch (error) {
    //   errorMsg = error;
    // }
    // fetching = false;
  };
</script>

<div class="flex flex-col gap-2">
  {#if errorMsg}
    <p class="text-xs error">{errorMsg}</p>
  {/if}
  <div
    class="flex gap-2 items-center cursor-pointer"
    on:pointerdown={() => refreshActivities($activities)}
  >
    <i
      class={`fa-solid fa-rotate-right hover:scale-110 transition-all text-black ${
        fetching ? 'fa-spin' : ''
      }`}
    />
    <p>{fetching ? 'Refreshing...' : 'Refresh activities'}</p>
  </div>
  <p>Latest activity: {formatDate(mostRecent.startDate)}</p>
</div>

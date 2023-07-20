<script lang="ts">
  import { activities } from '$lib/store';
  import { cleanActivities, formatDate } from '$lib/activity-utiils';
  import { getBatchActivities } from '$lib/api';
  import { getValidAuth, setLocalAuth, updateLocalActivities } from '$lib/auth-utils';
  import { writable } from 'svelte/store';
  import type { Activity } from '$types/client';

  export let numActivities: number;

  let fetching = false;
  let hasFetched = false;
  let errorMsg = '';
  let mostRecent: Activity = null;
  let timeAfter: number = null;
  const totalFetched = writable(0);

  $: if ($activities && $activities.length > 0) {
    mostRecent = $activities[$activities.length - 1];
    timeAfter = mostRecent && new Date(mostRecent.startDate).getTime() / 1000;
  }

  const addActivityToData = (activity: Activity) => {
    if (!$activities.find((a) => a.id === activity.id)) {
      $activities.push(activity);
      $activities = $activities;
    }
  };

  const refreshActivities = async () => {
    fetching = true;
    try {
      const userAuth = await getValidAuth();
      setLocalAuth(userAuth);
      const accessToken = userAuth.accessToken;
      const athleteId = userAuth.id;
      const rawActivities = await getBatchActivities(accessToken, totalFetched, timeAfter);
      const newActivities = cleanActivities(rawActivities);
      console.log({ newActivities });
      if (!$activities) $activities = newActivities;
      else newActivities.forEach((newA) => addActivityToData(newA));
      if (athleteId) updateLocalActivities(athleteId, $activities);
      else throw new Error('Authorization Error - try again');
      hasFetched = true;
      setTimeout(() => (hasFetched = false), 2000);
    } catch (error) {
      errorMsg = error;
    } finally {
      fetching = false;
    }
  };
</script>

<div class="flex gap-2">
  <div class="flex gap-2 items-center cursor-pointer" on:pointerdown={refreshActivities}>
    <i
      class={`fa-solid text-black ${
        hasFetched ? 'fa-check' : 'fa-rotate-right hover:scale-110 transition-all'
      }  ${fetching ? 'fa-spin' : ''}`}
    />
  </div>
  <p class="secondary">
    {#if mostRecent}
      <span>Latest activity: {formatDate(mostRecent.startDate)},</span>
    {/if}
    <span>{numActivities} activities</span>
  </p>
  {#if errorMsg}
    <p class="secondary error">{errorMsg}</p>
  {/if}
</div>

<script lang="ts">
  import { activities } from '$lib/store';
  import { cleanActivities, formatDate } from '$lib/activity-utiils';
  import { getBatchActivities } from '$lib/api';
  import { getValidAuth, updateLocalActivities } from '$lib/auth-utils';
  import { writable } from 'svelte/store';
  import type { Activity } from '$types/client';

  const totalFetched = writable(0);

  let fetching = false;
  let hasFetched = false;
  let errorMsg = '';
  let mostRecent: Activity = null;
  let timeAfter: number = null;

  $: if ($activities && $activities.length > 0) {
    mostRecent = $activities[$activities.length - 1];
    timeAfter = mostRecent && new Date(mostRecent.startDate).getTime() / 1000;
  }

  const refreshActivities = async () => {
    fetching = true;
    try {
      const userAuth = await getValidAuth();
      const accessToken = userAuth.accessToken;
      const athleteId = userAuth.id;
      const rawActivities = await getBatchActivities(accessToken, totalFetched, timeAfter);
      const newActivities = cleanActivities(rawActivities);
      console.log({ newActivities });
      newActivities.forEach((newA) => {
        if (!$activities.find((a) => a.id === newA.id)) {
          console.log('adding a new activity');
          $activities.push(newA);
          $activities = $activities;
        }
      });
      updateLocalActivities(athleteId, $activities);
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
  {#if mostRecent}
    <p class="secondary">Latest activity: {formatDate(mostRecent.startDate)}</p>
  {/if}
  {#if errorMsg}
    <p class="text-xs error">{errorMsg}</p>
  {/if}
</div>

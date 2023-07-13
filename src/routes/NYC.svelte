<script lang="ts">
  import { filterByCity } from '$lib/activity-utiils';
  import { getLocalActivities } from '$lib/auth-utils';
  import { NYC_BOUNDS, getPolyline } from '$lib/map-utils';
  import { activities } from '$lib/store';
  import type { Activity, Route, UserAuth } from '$types/client';
  import { onMount } from 'svelte';

  let error = '';
  let filteredActivities = $activities;
  let routes: Route[] = [];

  const loadActivities = () => {
    if (!$activities) {
      const userData = JSON.parse(localStorage.getItem('userAuth')) as UserAuth;
      const athleteId = userData ? userData.id : '';
      if (!athleteId) {
        error = 'No athlete data found, need to reload app to give permissions again';
        return;
      }

      const localActivities = getLocalActivities(athleteId);
      console.log({ localActivities });
      if (!localActivities) {
        // TO-DO: give option to refetch data
        error = 'No activities found. Try with a new user?';
        return;
      } else {
        $activities = localActivities;
      }
    }
  };

  const buildRoutes = (activities: Activity[]) =>
    activities.map((a) => {
      return {
        id: a.id,
        lineString: getPolyline(a.summaryPolyline),
        neighborhoods: []
      };
    });

  onMount(() => {
    loadActivities();
    if ($activities) {
      filteredActivities = filterByCity($activities, NYC_BOUNDS);
      routes = buildRoutes(filteredActivities);
    }
  });
</script>

<main class="flex flex-col gap-2">
  <p>NYC Activities</p>
  {#if error}
    <p>{error}</p>
  {/if}
  {#if $activities}
    {#each filteredActivities as activity}
      <p>{activity.name}</p>
    {/each}
  {/if}
</main>

<script lang="ts">
  import { filterByCity } from '$lib/activity-utiils';
  import { authURL, getLocalActivities } from '$lib/auth-utils';
  import { getPolyline } from '$lib/mapbox-utils';
  import { NYC_BOUNDS, featureToNeighborhood } from '$lib/nyc-constants';
  import { activities } from '$lib/store';
  import type { Activity, Route, UserAuth } from '$types/client';
  import BaseMap from '$components/BaseMap.svelte';
  import { getMaxValLength, mapNeighborhoodToRoutes, loadMapData } from '$lib/neighborhoods-utils';
  import type { Feature, FeatureCollection } from 'geojson';
  import NYCData from '$data/NYC.json';
  import Icon from '$components/global/Icon.svelte';
  import Panel from '$components/Panel.svelte';
  import SummaryStats from '$components/SummaryStats.svelte';

  let error = '';
  let filteredActivities: Activity[] = $activities;
  let routes: Route[] = [];
  let selectedId: number = null;

  const loadActivities = () => {
    if (!$activities) {
      const userData = JSON.parse(localStorage.getItem('userAuth')) as UserAuth;
      const athleteId = userData ? userData.id : '';
      if (!athleteId) {
        error = 'No athlete data found, need to reload app to give permissions again';
        return;
      }

      const localActivities = getLocalActivities(athleteId);
      if (!localActivities) {
        // TO-DO: give option to refetch data
        error = 'No activities found. Try with a new user?';
        return;
      } else {
        $activities = localActivities;
      }
    }
  };

  const buildRoutes = (activities: Activity[]) => {
    return activities.map((a) => {
      return {
        id: a.id,
        lineString: getPolyline(a.summaryPolyline),
        neighborhoods: []
      };
    });
  };

  $: featToRoutes = mapNeighborhoodToRoutes(NYCData as FeatureCollection, routes);
  $: neighborhoodsMapData = loadMapData(NYCData as FeatureCollection, featToRoutes);
  $: maxNumRoutes = getMaxValLength(featToRoutes);
  $: neighborhoods = neighborhoodsMapData.features.map((f: Feature) => featureToNeighborhood(f));

  loadActivities();
  $: if ($activities) {
    filteredActivities = filterByCity($activities, NYC_BOUNDS);
    routes = buildRoutes(filteredActivities);
  }
</script>

<main class="h-screen p-4 flex flex-col gap-2">
  <div class="flex w-full justify-between items-center">
    <h1>NYC</h1>
    <SummaryStats neighborhoodsMap={featToRoutes} numActivities={filteredActivities.length} />
  </div>
  {#if error}
    <p>{error}</p>
    <Icon icon="fa-solid fa-rotate-right" onClick={() => window.location.replace(authURL)} />
  {/if}
  <div class="flex gap-4 h-[500px]">
    <BaseMap {routes} data={neighborhoodsMapData} {maxNumRoutes} bind:selectedId />
    <Panel {neighborhoods} bind:selectedId />
  </div>
</main>

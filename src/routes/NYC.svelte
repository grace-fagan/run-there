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
  import InfoPanel from '$components/InfoPanel.svelte';
  import CityHeader from '$components/CityHeader.svelte';
  import RefreshFooter from '$components/RefreshFooter.svelte';

  let error = '';
  let filteredActivities: Activity[] = $activities;
  let numActivities = 0;
  let routes: Route[] = [];
  let selectedId: number = null;

  const loadActivities = () => {
    console.log('loading activities');
    if (!$activities) {
      const userData = JSON.parse(localStorage.getItem('userAuth')) as UserAuth;
      console.log({ userData });
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

  const buildRoutes = (activities: Activity[]) => {
    return activities.map((a) => {
      return {
        id: a.id,
        lineString: getPolyline(a.summaryPolyline),
        neighborhoods: []
      };
    });
  };

  // get top feature by value from map data
  const getTopFeature = (data: FeatureCollection) => {
    return data.features.reduce((top, curr) => {
      if (top.properties.value - curr.properties.value < 0) return curr;
      return top;
    });
  };

  loadActivities();

  $: if ($activities) {
    filteredActivities = filterByCity($activities, NYC_BOUNDS);
    numActivities = filteredActivities.length;
    routes = buildRoutes(filteredActivities);
  }
  $: featToRoutes = mapNeighborhoodToRoutes(NYCData as FeatureCollection, routes);
  $: neighborhoodsMapData = loadMapData(NYCData as FeatureCollection, featToRoutes);
  $: maxNumRoutes = getMaxValLength(featToRoutes);
  $: neighborhoods = neighborhoodsMapData.features.map((f: Feature) => featureToNeighborhood(f));
  $: numCompleted = Array.from(featToRoutes.values()).filter((arr) => arr.length > 0).length;
  $: totalNeighborhoods = featToRoutes.size;
  $: topNeighborhood = getTopFeature(neighborhoodsMapData).properties.name;
</script>

<main class="relative h-screen max-h-screen px-10 py-6 flex flex-col gap-4 max-w-6xl m-auto">
  <CityHeader city={'NYC'} {numCompleted} {totalNeighborhoods} />
  {#if error}
    <p>{error}</p>
    <Icon icon="fa-solid fa-rotate-right" onClick={() => window.location.replace(authURL)} />
  {/if}
  <div class="content flex flex-col gap-4 md:flex-row">
    <BaseMap {routes} data={neighborhoodsMapData} {maxNumRoutes} bind:selectedId />
    <InfoPanel {topNeighborhood} {neighborhoods} bind:selectedId />
  </div>
  <div class="h-4 md:h-8">
    <RefreshFooter {numActivities} />
  </div>
</main>

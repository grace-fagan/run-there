<script lang="ts">
  import { filterByCity } from '$lib/activity-utiils';
  import { getLocalActivities, getLocalAuth } from '$lib/auth-utils';
  import { getPolyline } from '$lib/mapbox-utils';
  import { NYC_BOUNDS, featureToNeighborhood } from '$lib/nyc-constants';
  import { activities, athleteId, isMobile } from '$lib/store';
  import type { Activity, Route } from '$types/client';
  import BaseMap from '$components/BaseMap.svelte';
  import { getMaxValLength, mapNeighborhoodToRoutes, loadMapData } from '$lib/neighborhoods-utils';
  import type { Feature, FeatureCollection } from 'geojson';
  import NYCData from '$data/NYC.json';
  import InfoPanel from '$components/InfoPanel.svelte';
  import CityHeader from '$components/CityHeader.svelte';
  import ConnectWithStrava from '$components/ConnectWithStrava.svelte';
  import Footer from '$components/Footer.svelte';

  let error = '';
  let filteredActivities: Activity[] = $activities;
  let numActivities = 0;
  let routes: Route[] = [];
  let selectedId: number = null;
  let showConnectStrava = false;

  const loadActivities = () => {
    if (!$activities) {
      const userData = getLocalAuth();
      if (!userData) {
        error = 'No athlete data found';
        showConnectStrava = true;
        return;
      }
      $athleteId = userData.id;
      const localActivities = getLocalActivities($athleteId);
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
    const topFeature = data.features.reduce((top, curr) => {
      if (top.properties.value - curr.properties.value < 0) return curr;
      return top;
    });
    if (topFeature.properties.value <= 0) return null;
    else return topFeature;
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
  $: topNeighborhood = getTopFeature(neighborhoodsMapData)?.properties.name;
</script>

<main
  class="relative h-screen max-h-screen px-4 md:px-10 pt-6 pb-2 flex flex-col gap-4 max-w-6xl m-auto"
>
  <div class="flex flex-col gap-0">
    <CityHeader city={'NYC'} {numCompleted} {totalNeighborhoods} />
    <div class="flex w-full gap-2 items-center">
      {#if error}
        <p class="error">{error}</p>
      {/if}
      {#if showConnectStrava}
        <ConnectWithStrava height={32} />
      {/if}
    </div>
  </div>

  <div class="content flex flex-col gap-2 md:gap-4 md:flex-row">
    <BaseMap {routes} data={neighborhoodsMapData} {maxNumRoutes} bind:selectedId />
    <InfoPanel {topNeighborhood} {neighborhoods} bind:selectedId />
  </div>
  {#if $isMobile}<p>Mobile</p>{:else}
    <Footer {numActivities} />
  {/if}
</main>

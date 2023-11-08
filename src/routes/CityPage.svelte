<script lang="ts">
  import { cityInfo, filterByCity } from '$lib/city-utils';
  import { getLocalActivities, getLocalAuth } from '$lib/auth-utils';
  import { featureToNeighborhood } from '$lib/nyc-constants';
  import { activities, boroughs, athleteId, isMobile, city } from '$lib/store';
  import BaseMap from '$components/BaseMap.svelte';
  import {
    getMaxValLength,
    mapNeighborhoodToRoutes,
    loadMapData,
    loadBoroughData,
    getBoroughFromId,
    getFeatIdToRoutesMap
  } from '$lib/neighborhoods-utils';
  import type { Feature, FeatureCollection, MultiPolygon, Polygon } from 'geojson';
  import NYCData from '$data/neighborhoods/NYC.json';
  import InfoPanel from '$components/InfoPanel.svelte';
  import CityHeader from '$components/CityHeader.svelte';
  import ConnectWithStrava from '$components/ConnectWithStrava.svelte';
  import Footer from '$components/Footer.svelte';
  import type { ClientBorough, Neighborhood } from '$types/neighborhoods/nyc';
  import type { Activity } from '$types/client';

  export let cityName: string;

  let error = '';
  let selectedId: number = null;
  let showConnectStrava = false;
  let selectedBorough: ClientBorough = null;
  let selectedNeighborhood: Neighborhood = null;
  let cityPolygon: Polygon | MultiPolygon;
  let filteredActivities: Activity[];

  const loadActivities = () => {
    if (!$activities) {
      const userData = getLocalAuth();
      if (!userData) {
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

  const loadCity = async () => {
    $city = cityInfo[cityName];
    const res = await fetch(`../src/data/city_boundaries/${cityName}.json`);
    //TODO: what if city boundaries is not feature type
    const cityBoundaries = (await res.json()) as Feature;
    cityPolygon = cityBoundaries.geometry as Polygon | MultiPolygon;
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
  loadCity();

  $: if (cityPolygon) filteredActivities = filterByCity($activities, cityPolygon);
  $: numActivities = filteredActivities?.length || 0;
  $: routes = mapNeighborhoodToRoutes(NYCData as FeatureCollection, filteredActivities);
  $: featToRoutes = getFeatIdToRoutesMap(NYCData as FeatureCollection, routes);
  $: neighborhoodsMapData = loadMapData(NYCData as FeatureCollection, featToRoutes);
  $: maxNumRoutes = getMaxValLength(featToRoutes);
  $: neighborhoods = neighborhoodsMapData.features.map((f: Feature) => featureToNeighborhood(f));
  $: $boroughs = loadBoroughData(neighborhoods);
  $: numCompleted = Array.from(featToRoutes.values()).filter((arr) => arr.length > 0).length;
  $: totalNeighborhoods = featToRoutes.size;
  $: topNeighborhood = getTopFeature(neighborhoodsMapData)?.properties.name;

  $: if (selectedId) {
    selectedNeighborhood = neighborhoods?.find((n) => n.id === selectedId);
    selectedBorough = getBoroughFromId(selectedNeighborhood.parent);
  }

  $: console.log({ $activities });
</script>

<main
  class="relative h-screen max-h-screen px-4 md:px-10 pt-6 pb-2 flex flex-col gap-4 max-w-6xl m-auto"
>
  <div class="flex flex-col gap-0">
    <CityHeader city={$city.display} {numCompleted} {totalNeighborhoods} />
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
    <BaseMap
      {routes}
      data={neighborhoodsMapData}
      {maxNumRoutes}
      {selectedBorough}
      bind:selectedId
    />
    <InfoPanel
      {topNeighborhood}
      {numActivities}
      {selectedNeighborhood}
      {selectedBorough}
      bind:selectedId
      on:selectBorough={(b) => (selectedBorough = b.detail)}
    />
  </div>
  {#if !$isMobile}
    <Footer {numActivities} />
  {/if}
</main>

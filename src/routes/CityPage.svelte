<script lang="ts">
  import { cityInfo, filterByCity } from '$lib/city-utils';
  import { getLocalActivities, getLocalAuth } from '$lib/auth-utils';
  import { featureToNeighborhood } from '$lib/nyc-constants';
  import { activities, regions, athleteId, isMobile, city, cityLoaded } from '$lib/store';
  import BaseMap from '$components/BaseMap.svelte';
  import {
    getRoutes,
    loadMapData,
    loadRegionData,
    getRegionFromId,
    getFeatureMap
  } from '$lib/neighborhoods-utils';
  import type { Feature, FeatureCollection, MultiPolygon, Polygon } from 'geojson';
  import InfoPanel from '$components/InfoPanel.svelte';
  import CityHeader from '$components/CityHeader.svelte';
  import ConnectWithStrava from '$components/ConnectWithStrava.svelte';
  import Footer from '$components/Footer.svelte';
  import type { Region, Neighborhood } from '$types/neighborhoods/nyc';
  import type { Activity, Route } from '$types/client';
  import CityOptions from '$components/CityOptions.svelte';

  export let cityName: string;

  let loading = false;
  let error = '';
  let selectedId: number = null;
  let showConnectStrava = false;
  let selectedRegion: Region = null;
  let selectedNeighborhood: Neighborhood = null;
  let cityPolygon: Polygon | MultiPolygon;
  let filteredActivities: Activity[];
  let neighborhoodData: FeatureCollection;
  let routes: Route[];
  let neighborhoods: Neighborhood[];
  let mapData: FeatureCollection;
  let featureMap: Map<number, string[]>;

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

  const hydrateData = () => {
    routes = getRoutes(neighborhoodData, filteredActivities);
    featureMap = getFeatureMap(neighborhoodData, routes);
    mapData = loadMapData(neighborhoodData, featureMap);
    neighborhoods = mapData.features.map((f: Feature) => featureToNeighborhood(f));
    $regions = cityName === 'nyc' ? loadRegionData(neighborhoodData, neighborhoods) : null;
  };

  const loadCity = async () => {
    loading = true;
    $city = cityInfo[cityName];

    fetch(`../src/data/city_boundaries/${cityName}.json`).then(async (res) => {
      const bounds = (await res.json()) as Feature;
      cityPolygon = bounds.geometry as Polygon | MultiPolygon;
      filteredActivities = filterByCity($activities, cityPolygon);

      fetch(`../src/data/neighborhoods/${cityName}.json`).then(async (res) => {
        neighborhoodData = (await res.json()) as FeatureCollection;
        hydrateData();
        loading = false;
        $cityLoaded = true;
      });
    });
  };

  loadActivities();

  $: if (cityName) loadCity();
  $: if (selectedId) {
    selectedNeighborhood = neighborhoods?.find((n) => n.id === selectedId);
    if ($regions) selectedRegion = getRegionFromId(selectedNeighborhood.parent);
  }
</script>

<main
  class="relative h-screen max-h-screen px-4 md:px-10 pt-6 pb-2 flex flex-col gap-1 max-w-6xl m-auto"
>
  <div class="flex flex-col gap-1">
    <CityOptions />
    <CityHeader city={$city.display} {featureMap} />
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
    <BaseMap {routes} data={mapData} {featureMap} {selectedRegion} bind:selectedId />
    <InfoPanel
      {neighborhoods}
      {selectedNeighborhood}
      {selectedRegion}
      bind:selectedId
      on:selectRegion={(b) => (selectedRegion = b.detail)}
    />
  </div>
  {#if !$isMobile}
    <Footer />
  {/if}
</main>

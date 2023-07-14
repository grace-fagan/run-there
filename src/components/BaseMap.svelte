<script lang="ts">
  import { addGeoJsonToMap, cleanNeighborhoodsData, createMap } from '$lib/map-utils';
  import { onMount } from 'svelte';
  import NYCData from '$data/NYC.json';
  import type { FeatureCollection } from 'geojson';
  import { NYC_CENTER } from '$lib/nyc-constants';
  import { Map } from 'mapbox-gl';

  let map: Map = null;
  const neighborhoodsData = cleanNeighborhoodsData(NYCData as FeatureCollection);

  onMount(() => {
    map = createMap(NYC_CENTER);
    map.on('load', () => {
      addGeoJsonToMap(map, 'neighborhoods', neighborhoodsData);
    });
  });
</script>

<div id="map" class="flex-grow w-1/2" />

<script lang="ts">
  import {
    addNeighborhoodsToMap,
    addOutlinesToMap,
    addRoutesToMap,
    addSelectedLayerToMap,
    createMap,
    hoverFeature,
    NEIGHBORHOODS_SRC,
    toggleRoutes,
    unhoverFeature
  } from '$lib/mapbox-utils';
  import { onMount } from 'svelte';
  import type { Feature, FeatureCollection } from 'geojson';
  import { NYC_CENTER } from '$lib/nyc-constants';
  import { Map as MapboxMap, MapMouseEvent } from 'mapbox-gl';
  import type { Route } from '$types/client';

  export let routes: Route[];
  export let neighborhoodsData: FeatureCollection;
  export let maxNumRoutes: number;

  let basemap: MapboxMap = null;
  let mapLoaded = false;

  $: if (mapLoaded && basemap && routes) addRoutesToMap(basemap, routes);
  let featToHover: Feature = null;
  $: if (mapLoaded && !featToHover) toggleRoutes(basemap, routes);

  const handleMousemove = (e: MapMouseEvent) => {
    basemap.getCanvas().style.cursor = 'pointer';
    // if no feature exists or the feature is already hovered, return
    if (e.features.length === 0) return;
    const currFeat = e.features[0];
    if (featToHover?.id === currFeat.id) return;
    // else unhover old feature and hover new feature
    unhoverFeature(basemap, featToHover);
    featToHover = currFeat;
    toggleRoutes(basemap, routes, false);
    hoverFeature(basemap, featToHover);
  };

  const handleMouseleave = () => {
    if (featToHover) unhoverFeature(basemap, featToHover);
    featToHover = null;
  };

  onMount(() => {
    basemap = createMap(NYC_CENTER);
    basemap.on('load', () => {
      mapLoaded = true;
      const neighborhoodsLayer = addNeighborhoodsToMap(basemap, neighborhoodsData, maxNumRoutes);
      addSelectedLayerToMap(basemap, NEIGHBORHOODS_SRC);
      addOutlinesToMap(basemap, NEIGHBORHOODS_SRC);

      basemap.on('mousemove', neighborhoodsLayer, handleMousemove);
      basemap.on('mouseleave', neighborhoodsLayer, handleMouseleave);
    });
  });
</script>

<div id="map" class="flex-grow w-full" />

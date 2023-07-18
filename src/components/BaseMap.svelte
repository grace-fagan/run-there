<script lang="ts">
  import {
    addNeighborhoodsToMap,
    addOutlinesToMap,
    addRoutesToMap,
    addSelectedLayerToMap,
    createMap,
    hideFeatureRoutes,
    hoverFeature,
    NEIGHBORHOODS_SRC,
    selectNeighborhood,
    showFeatureRoutes,
    toggleRoutes,
    unhoverFeature
  } from '$lib/mapbox-utils';
  import { afterUpdate, onMount } from 'svelte';
  import type { Feature, FeatureCollection } from 'geojson';
  import { NYC_CENTER } from '$lib/nyc-constants';
  import { Map as MapboxMap, MapMouseEvent } from 'mapbox-gl';
  import type { Route } from '$types/client';

  export let routes: Route[];
  export let neighborhoodsData: FeatureCollection;
  export let maxNumRoutes: number;
  export let visibleFeat: Feature;

  let basemap: MapboxMap = null;
  let mapLoaded = false;
  let hoveredFeat: Feature = null;
  let selectedFeat: Feature = null;
  let prevVisibleFeat: Feature = null;
  let showAllRoutes = true;

  $: visibleFeat = hoveredFeat || selectedFeat;
  $: if (mapLoaded && basemap && routes) addRoutesToMap(basemap, routes);
  $: showAllRoutes = !selectedFeat;
  $: if (mapLoaded) {
    toggleRoutes(basemap, routes, showAllRoutes);
    if (!showAllRoutes) showFeatureRoutes(basemap, visibleFeat);
  }

  const watchVisibleFeature = (oldVal: Feature, newVal: Feature) => {
    unhoverFeature(basemap, oldVal);
    hoverFeature(basemap, newVal);
  };

  const handleMousemove = (e: MapMouseEvent) => {
    basemap.getCanvas().style.cursor = 'pointer';
    // if no feature exists or the feature is already hovered, return
    if (e.features.length === 0) return;
    const currFeat = e.features[0];
    if (hoveredFeat?.id === currFeat?.id) return;
    // else unhover old feature and hover new feature
    unhoverFeature(basemap, hoveredFeat);
    hoveredFeat = currFeat;
    hoverFeature(basemap, hoveredFeat);
  };

  const handleMouseleave = () => {
    // if the hovered feature is the selected feature, return
    if (hoveredFeat && hoveredFeat?.id === selectedFeat?.id) return;
    unhoverFeature(basemap, hoveredFeat);
    if (!showAllRoutes) hideFeatureRoutes(basemap, hoveredFeat);
    hoveredFeat = null;
  };

  const handleClick = (e: MapMouseEvent) => {
    if (e.features.length === 0) return;
    const currFeat = e.features[0];
    selectedFeat = currFeat.id === selectedFeat?.id ? null : currFeat;
    selectNeighborhood(basemap, selectedFeat, NYC_CENTER);
    hoverFeature(basemap, currFeat);
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
      basemap.on('click', neighborhoodsLayer, handleClick);
    });
  });

  // handles watching the visible feature value and retaining its old value
  afterUpdate(() => {
    if (prevVisibleFeat?.id !== visibleFeat?.id) {
      watchVisibleFeature(prevVisibleFeat, visibleFeat);
      prevVisibleFeat = visibleFeat;
    }
  });
</script>

<div class="relative flex-grow">
  <div id="map" class="w-full h-full" />
  <slot />
</div>

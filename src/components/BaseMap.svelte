<script lang="ts">
  import {
    addNeighborhoodsToMap,
    addOutlinesToMap,
    addRoutesToMap,
    addSelectedLayerToMap,
    createMap,
    hideFeatureRoutes,
    hoverFeature,
    moveToRegion,
    NEIGHBORHOODS_SRC,
    selectNeighborhood,
    showFeatureRoutes,
    toggleRoutes,
    unhoverFeature
  } from '$lib/mapbox-utils';
  import { afterUpdate, onMount } from 'svelte';
  import type { Feature, FeatureCollection } from 'geojson';
  import { Map as MapboxMap, MapMouseEvent } from 'mapbox-gl';
  import type { Route } from '$types/client';
  import Tag from './Tag.svelte';
  import { city, isMobile } from '$lib/store';
  import type { Region } from '$types/neighborhoods/nyc';

  export let routes: Route[];
  export let data: FeatureCollection;
  export let maxNumRoutes: number;
  export let selectedId: number = null;
  export let selectedRegion: Region = null;

  let basemap: MapboxMap = null;
  let mapHeight: number = null;
  let mapLoaded = false;
  let hoveredFeat: Feature = null;
  let visibleFeat: Feature = null;
  let prevVisibleFeat: Feature = null;
  let showAllRoutes = true;

  $: selectedFeat = data.features.find((f) => f.id === selectedId) as Feature;
  $: visibleFeat = hoveredFeat || selectedFeat;
  $: showAllRoutes = !selectedFeat;

  $: if (mapHeight && basemap) basemap.resize();

  $: if (mapLoaded && basemap && routes) {
    addRoutesToMap(basemap, routes);
    addOutlinesToMap(basemap, NEIGHBORHOODS_SRC);
  }

  // runs when showAllRoutes changes
  $: if (mapLoaded) {
    toggleRoutes(basemap, routes, showAllRoutes);
    if (!showAllRoutes) showFeatureRoutes(basemap, visibleFeat);
  }

  // runs when selectedFeat changes
  $: if (mapLoaded) {
    selectNeighborhood(basemap, selectedFeat, $city.center);
    hoverFeature(basemap, selectedFeat);
  }

  $: if (mapLoaded && !selectedFeat) moveToRegion(basemap, selectedRegion, $city.center);

  const watchVisibleFeature = (oldVal: Feature, newVal: Feature) => {
    if (mapLoaded) {
      unhoverFeature(basemap, oldVal);
      hoverFeature(basemap, newVal);
    }
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
    selectedId = currFeat.id === selectedId ? null : currFeat.id;
  };

  onMount(() => {
    basemap = createMap($city.center);
    basemap.on('load', () => {
      mapLoaded = true;
      const neighborhoodsLayer = addNeighborhoodsToMap(basemap, data, maxNumRoutes);
      addSelectedLayerToMap(basemap, NEIGHBORHOODS_SRC);

      if (!$isMobile) {
        basemap.on('mousemove', neighborhoodsLayer, handleMousemove);
        basemap.on('mouseleave', neighborhoodsLayer, handleMouseleave);
      }
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

<div class="relative grow h-full">
  <div id="map" class="w-full h-full" bind:clientHeight={mapHeight} />
  {#if visibleFeat}
    <Tag feature={visibleFeat} />
  {/if}
</div>

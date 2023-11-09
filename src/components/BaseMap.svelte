<script lang="ts">
  import {
    addNeighborhoodsToMap,
    addOutlinesToMap,
    addRoutesToMap,
    addSelectedLayerToMap,
    createMap,
    hideFeatureRoutes,
    hoverFeature,
    moveToCity,
    moveToRegion,
    NEIGHBORHOODS_SRC,
    removeLayers,
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
  import { getMaxValLength } from '$lib/neighborhoods-utils';

  export let routes: Route[];
  export let data: FeatureCollection;
  export let featureMap: Map<number, string[]>;
  export let selectedId: number = null;
  export let selectedRegion: Region = null;

  let basemap: MapboxMap = null;
  let mapHeight: number = null;
  let mapLoaded = false;

  let neighborhoodsLayer: string = '';
  let selectedLayer: string = '';
  let outlineLayer: string = ';';

  let hoveredFeat: Feature = null;
  let prevVisibleFeat: Feature = null;
  let showAllRoutes = true;

  $: selectedFeat = data ? (data.features.find((f) => f.id === selectedId) as Feature) : null;
  $: visibleFeat = hoveredFeat || selectedFeat;
  $: showAllRoutes = !selectedFeat;

  $: if (mapHeight && basemap) basemap.resize();

  $: if ($city && featureMap) {
    const maxRoutes = getMaxValLength(featureMap);
    if (mapLoaded && basemap) {
      removeLayers(basemap, [selectedLayer, outlineLayer, neighborhoodsLayer]);
      neighborhoodsLayer = addNeighborhoodsToMap(basemap, data, maxRoutes);
      selectedLayer = addSelectedLayerToMap(basemap, NEIGHBORHOODS_SRC);
      addRoutesToMap(basemap, routes);
      outlineLayer = addOutlinesToMap(basemap, NEIGHBORHOODS_SRC);
      moveToCity(basemap);
    }
  }

  $: if (basemap && neighborhoodsLayer) {
    if (!$isMobile) {
      basemap.on('mousemove', neighborhoodsLayer, handleMousemove);
      basemap.on('mouseleave', neighborhoodsLayer, handleMouseleave);
    }
    basemap.on('click', neighborhoodsLayer, handleClick);
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

  $: if (mapLoaded && !selectedFeat) moveToRegion(basemap, selectedRegion);

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
    basemap.on('load', () => (mapLoaded = true));
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

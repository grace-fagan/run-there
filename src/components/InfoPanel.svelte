<script lang="ts">
  import type { Region, Neighborhood } from '$types/neighborhoods/nyc';
  import { afterUpdate, tick } from 'svelte';
  import { city, cityLoaded, regions, isMobile } from '$lib/store';
  import NeighborhoodsList from './NeighborhoodsList.svelte';
  import { createEventDispatcher } from 'svelte';
  import InfoPanelModal from './InfoPanelModal.svelte';
  import RegionHeader from './RegionHeader.svelte';
  import { getAllRuns, getRegionFromId } from '$lib/neighborhoods-utils';
  import LoadingSpinner from './utils/LoadingSpinner.svelte';

  const dispatch = createEventDispatcher();
  export let neighborhoods: Neighborhood[];
  export let selectedId: number;
  export let selectedNeighborhood: Neighborhood;
  export let selectedRegion: Region;

  let maxNeighborhoods: number;
  let topRegion: string;
  let topNeighborhood: string;
  let regionVisibility: Map<number, boolean>;

  const getTopNeighborhood = (data: Neighborhood[]) => {
    if (!data) return null;
    const topFeature = data.reduce((top, curr) => {
      if (top.runs.length - curr.runs.length < 0) return curr;
      return top;
    });
    if (topFeature.runs.length <= 0) return null;
    else return topFeature;
  };

  let modalOpen = false;
  let prevSelectedNeighborhood: Neighborhood = null;

  $: if ($cityLoaded) {
    topNeighborhood = getTopNeighborhood(neighborhoods).name;
    if ($regions) {
      maxNeighborhoods = $regions.reduce((a, b) => Math.max(a, b.neighborhoods.length), 0);
      topRegion = $regions && $regions[0].runs.length <= 0 ? 'n/a' : $regions[0].name;
      regionVisibility = new Map<number, boolean>(
        $regions.map((b) => {
          const visible = selectedRegion?.id === b.id;
          return [b.id, visible];
        })
      );
    }
  }

  $: enableScrolling = $isMobile ? modalOpen : true;

  const toggleRegion = (id: number) => {
    if (selectedRegion && selectedRegion.id === id) {
      selectedRegion = null;
      selectedId = null;
    } else selectedRegion = getRegionFromId(id);
    if (!selectedRegion) selectedId = null;
    dispatch('selectRegion', selectedRegion);
  };

  const watchSelectedNeighborhood = (oldVal: Neighborhood, newVal: Neighborhood) => {
    if (!$regions) return;
    if (oldVal) regionVisibility = regionVisibility.set(oldVal.parent, false);
    if (newVal) regionVisibility = regionVisibility.set(newVal.parent, true);
  };

  // handles watching the selected neighborhood value and retaining its old value
  afterUpdate(async () => {
    if (prevSelectedNeighborhood?.id !== selectedNeighborhood?.id) {
      watchSelectedNeighborhood(prevSelectedNeighborhood, selectedNeighborhood);
      prevSelectedNeighborhood = selectedNeighborhood;
      await tick();
      if (selectedNeighborhood && enableScrolling) {
        const toScroll = document.getElementById(selectedNeighborhood.id.toString());
        toScroll &&
          toScroll.scrollIntoView({
            block: 'center',
            inline: 'nearest',
            behavior: 'smooth'
          });
      }
    }
  });
</script>

{#if $isMobile}
  <InfoPanelModal
    {selectedRegion}
    {toggleRegion}
    {maxNeighborhoods}
    bind:selectedId
    bind:modalOpen
  />
{:else}
  <div class="flex flex-col w-full md:w-1/3 md:gap-2 max-h-1/2 md:h-auto">
    {#if $cityLoaded}
      <div class="flex flex-col md: gap-2 py-2 md:py-4">
        {#if $regions}
          <p>Top {$city.secondary || 'region'}: <span class="font-semibold">{topRegion}</span></p>
        {/if}
        <p>Top neighborhood: <span class="font-semibold">{topNeighborhood || 'n/a'}</span></p>
      </div>
      {#if $regions}
        <div
          class="grid grid-cols-[25px_100px_auto] gap-3 md:mt-2 border-b border-stone-200 text-stone-400"
        >
          <p class="col-span-2">Activities</p>
          <p>Neighborhoods</p>
        </div>
        {#each $regions as region}
          <RegionHeader {region} handler={toggleRegion} {maxNeighborhoods} />
          {#if !$isMobile && regionVisibility.get(region.id)}
            <NeighborhoodsList
              neighborhoods={region.neighborhoods}
              numActivities={region.runs.length}
              bind:selectedId
            />
          {/if}
        {/each}
      {:else}
        <NeighborhoodsList
          {neighborhoods}
          numActivities={getAllRuns(neighborhoods).length}
          bind:selectedId
          showActivities={true}
        />
      {/if}
    {:else}
      <div class="grow flex items-center justify-center">
        <LoadingSpinner borderColor="#F5F5F4" borderTop="#1F2937" />
      </div>
    {/if}
  </div>
{/if}

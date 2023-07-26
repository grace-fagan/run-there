<script lang="ts">
  import type { ClientBorough, Neighborhood } from '$types/neighborhoods/nyc';
  import { getBoroughFromId } from '$lib/neighborhoods-utils';
  import { afterUpdate, tick } from 'svelte';
  import { boroughs, isMobile } from '$lib/store';
  import NeighborhoodsList from './NeighborhoodsList.svelte';
  import BoroughHeader from './BoroughHeader.svelte';
  import { createEventDispatcher } from 'svelte';
  import InfoPanelModal from './InfoPanelModal.svelte';

  const dispatch = createEventDispatcher();
  export let topNeighborhood: string;
  export let selectedId: number;
  export let numActivities: number;
  export let selectedNeighborhood: Neighborhood;
  export let selectedBorough: ClientBorough;

  let prevSelectedNeighborhood: Neighborhood = null;
  $: maxNeighborhoods = $boroughs.reduce((a, b) => Math.max(a, b.neighborhoods.length), 0);
  $: topBorough = $boroughs[0].runs.length <= 0 ? 'n/a' : $boroughs[0].name;

  $: visibility = new Map<number, boolean>(
    $boroughs.map((b) => {
      const visible = selectedBorough?.id === b.id;
      return [b.id, visible];
    })
  );

  const toggleBorough = (id: number) => {
    if (selectedBorough && selectedBorough.id === id) {
      selectedBorough = null;
      selectedId = null;
    } else selectedBorough = getBoroughFromId(id);
    if (!selectedBorough) selectedId = null;
    dispatch('selectBorough', selectedBorough);
  };

  const watchSelectedNeighborhood = (oldVal: Neighborhood, newVal: Neighborhood) => {
    if (oldVal) visibility = visibility.set(oldVal.borough, false);
    if (newVal) visibility = visibility.set(newVal.borough, true);
  };

  // handles watching the selected neighborhood value and retaining its old value
  afterUpdate(async () => {
    if (prevSelectedNeighborhood?.id !== selectedNeighborhood?.id) {
      watchSelectedNeighborhood(prevSelectedNeighborhood, selectedNeighborhood);
      prevSelectedNeighborhood = selectedNeighborhood;
      await tick();
      if (selectedNeighborhood && !$isMobile) {
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
    {selectedBorough}
    {toggleBorough}
    {maxNeighborhoods}
    {numActivities}
    bind:selectedId
  />
{:else}
  <div class="flex flex-col w-full md:w-1/3 md:gap-2 max-h-1/2 md:h-auto">
    <div class="flex flex-col md: gap-2 py-2 md:py-4">
      <p>Top borough: <span class="font-semibold">{topBorough}</span></p>
      <p>Top neighborhood: <span class="font-semibold">{topNeighborhood || 'n/a'}</span></p>
    </div>
    <div
      class="grid grid-cols-[25px_100px_auto] gap-3 md:mt-2 border-b border-stone-200 text-stone-400"
    >
      <p class="col-span-2">Activities</p>
      <p>Neighborhoods</p>
    </div>
    {#each $boroughs as borough}
      <BoroughHeader {borough} handler={toggleBorough} {maxNeighborhoods} />
      {#if !$isMobile && visibility.get(borough.id)}
        <NeighborhoodsList
          neighborhoods={borough.neighborhoods}
          numActivities={borough.runs.length}
          bind:selectedId
        />
      {/if}
    {/each}
  </div>
{/if}

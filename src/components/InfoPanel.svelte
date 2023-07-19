<script lang="ts">
  import type { ClientBorough, Neighborhood } from '$types/neighborhoods/nyc';
  import { loadBoroughData } from '$lib/neighborhoods-utils';
  import { afterUpdate, tick } from 'svelte';
  import ProgressBar from './ProgressBar.svelte';
  import { isMobile } from '$lib/store';
  import NeighborhoodsList from './NeighborhoodsList.svelte';
  import BoroughHeader from './BoroughHeader.svelte';

  export let neighborhoods: Neighborhood[];
  export let selectedId: number;

  let selectedBorough: ClientBorough = null;
  let prevSelectedNeighborhood: Neighborhood = null;
  $: selectedNeighborhood = selectedId ? neighborhoods.find((n) => n.id === selectedId) : null;
  $: maxNeighborhoods = boroughs.reduce((a, b) => Math.max(a, b.neighborhoods.length), 0);
  $: selectedBorough = selectedNeighborhood ? getBorough(selectedNeighborhood.borough) : null;

  const boroughs = loadBoroughData(neighborhoods);
  let visibility = new Map<number, boolean>(
    boroughs.map((b) => {
      const visible = selectedNeighborhood?.borough === b.id;
      return [b.id, visible];
    })
  );

  const getBorough = (id: number) => boroughs.find((b) => b.id === id);

  const toggleVisibility = (id: number) => {
    const visible = visibility.get(id);
    visibility = visibility.set(id, !visible);
    selectedBorough = visible ? null : getBorough(id);
    if (!selectedBorough) selectedId = null;
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
  $: console.log($isMobile, selectedBorough);
</script>

{#if $isMobile && selectedBorough}
  <div class="h-1/2">
    <div class="flex w-full gap-4 h-1/2">
      <i
        class="pt-3 fa-solid fa-arrow-left text-black"
        on:pointerdown={() => toggleVisibility(selectedBorough.id)}
      />
      <div class="h-full grow">
        <BoroughHeader borough={selectedBorough} {maxNeighborhoods} />
        <NeighborhoodsList neighborhoods={selectedBorough.neighborhoods} bind:selectedId />
      </div>
    </div>
  </div>
{:else}
  <div class="flex flex-col w-full md:w-1/3 gap-2 h-1/2 md:h-auto">
    <div class="grid grid-cols-[25px_100px_auto] gap-3 border-b border-stone-200 text-stone-400">
      <p class="col-span-2">Activities</p>
      <p>Neighborhoods</p>
    </div>
    {#each boroughs as borough}
      <BoroughHeader {borough} {toggleVisibility} {maxNeighborhoods} />
      {#if !$isMobile && visibility.get(borough.id)}
        <NeighborhoodsList {neighborhoods} bind:selectedId />
      {/if}
    {/each}
  </div>
{/if}
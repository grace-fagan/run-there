<script lang="ts">
  import ProgressBar from './ProgressBar.svelte';
  import type { ClientBorough } from '$types/neighborhoods/nyc';
  import { getCompletedNeighborhoods } from '$lib/neighborhoods-utils';
  export let handler: (id: number) => void = null;
  export let borough: ClientBorough;
  export let maxNeighborhoods: number;
  export let showActivities = true;
</script>

<div
  class={`grid ${
    showActivities ? 'grid-cols-[25px_100px_auto]' : 'grid-cols-[100px_auto]'
  } gap-2 cursor-pointer p-2 h-9 md:hover:bg-stone-200 rounded-md`}
  on:click={() => handler && handler(borough.id)}
  on:keydown={() => handler && handler(borough.id)}
  role="none"
>
  {#if showActivities}
    <p>{borough.runs.length}</p>
  {/if}
  <p class="font-semibold">{borough.name}</p>
  <ProgressBar
    completed={getCompletedNeighborhoods(borough.neighborhoods)}
    color={borough.color}
    total={borough.neighborhoods.length}
    maxTotal={maxNeighborhoods}
  />
</div>

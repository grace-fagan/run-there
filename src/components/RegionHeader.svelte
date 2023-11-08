<script lang="ts">
  import ProgressBar from './ProgressBar.svelte';
  import type { Region } from '$types/neighborhoods/nyc';
  import { getCompletedNeighborhoods } from '$lib/neighborhoods-utils';
  export let handler: (id: number) => void = null;
  export let region: Region;
  export let maxNeighborhoods: number;
  export let showActivities = true;
</script>

<div
  class={`grid ${
    showActivities ? 'grid-cols-[25px_100px_auto]' : 'grid-cols-[100px_auto]'
  } gap-2 cursor-pointer p-2 h-9 md:hover:bg-stone-200 rounded-md`}
  on:click={() => handler && handler(region.id)}
  on:keydown={() => handler && handler(region.id)}
  role="none"
>
  {#if showActivities}
    <p>{region.runs.length}</p>
  {/if}
  <p class="font-semibold">{region.name}</p>
  <ProgressBar
    completed={getCompletedNeighborhoods(region.neighborhoods)}
    color={region.color}
    total={region.neighborhoods.length}
    maxTotal={maxNeighborhoods}
  />
</div>

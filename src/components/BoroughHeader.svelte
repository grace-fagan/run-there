<script lang="ts">
  import ProgressBar from './ProgressBar.svelte';
  import type { ClientBorough } from '$types/neighborhoods/nyc';
  import { getCompletedNeighborhoods } from '$lib/neighborhoods-utils';
  export let handler: (id: number) => void = null;
  export let borough: ClientBorough;
  export let maxNeighborhoods: number;
  export let showActivities = true;

  const { id, name, color, neighborhoods, runs } = borough;
</script>

<div
  class={`grid ${
    showActivities ? 'grid-cols-[25px_100px_auto]' : 'grid-cols-[100px_auto]'
  } gap-2 cursor-pointer p-2 h-9 md:hover:bg-stone-200 rounded-md`}
  on:click={() => handler && handler(id)}
  on:keydown={() => handler && handler(id)}
  role="none"
>
  {#if showActivities}
    <p>{runs.length}</p>
  {/if}
  <p class="font-semibold">{name}</p>
  <ProgressBar
    completed={getCompletedNeighborhoods(neighborhoods)}
    {color}
    total={neighborhoods.length}
    maxTotal={maxNeighborhoods}
  />
</div>

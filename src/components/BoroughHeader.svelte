<script lang="ts">
  import ProgressBar from './ProgressBar.svelte';
  import type { ClientBorough } from '$types/neighborhoods/nyc';
  import { getCompletedNeighborhoods } from '$lib/neighborhoods-utils';
  export let toggleVisibility: (id: number) => void = null;
  export let borough: ClientBorough;
  export let maxNeighborhoods: number;

  const { id, name, color, neighborhoods, runs } = borough;
</script>

<div
  class="grid grid-cols-[25px_100px_auto] gap-2 cursor-pointer p-2 h-9 hover:bg-stone-200 rounded-md"
  on:pointerdown={() => toggleVisibility && toggleVisibility(id)}
>
  <p>{runs.length}</p>
  <p class="font-semibold">{name}</p>
  <ProgressBar
    completed={getCompletedNeighborhoods(neighborhoods)}
    {color}
    total={neighborhoods.length}
    maxTotal={maxNeighborhoods}
  />
</div>

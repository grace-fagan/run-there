<script lang="ts">
  import type { Neighborhood } from '$types/neighborhoods/nyc';
  import { isMobile } from '$lib/store';
  import { getCompletedNeighborhoods } from '$lib/neighborhoods-utils';

  export let selectedId: number;
  export let neighborhoods: Neighborhood[];
  const toggleNeighborhood = (id: number) => (selectedId = selectedId === id ? null : id);
  $: percentComplete = Math.round(
    (getCompletedNeighborhoods(neighborhoods) / neighborhoods.length) * 100
  );
</script>

<div
  class="flex flex-col gap-2 overflow-scroll py-2 px-4 bg-white rounded-md"
  style="height: {$isMobile ? 'calc(100% - 2.25rem)' : 'auto'}"
>
  <p class="text-stone-400">{percentComplete}% complete</p>
  {#each neighborhoods as n, i}
    <div
      class="flex gap-2 items-center cursor-pointer"
      id={n.id.toString()}
      on:click={() => toggleNeighborhood(n.id)}
      on:keydown={() => toggleNeighborhood(n.id)}
      role="tab"
      tabindex={i}
    >
      <i class={`fa-solid fa-check text-md ${n.runs.length > 0 ? 'text-black' : 'text-white'}`} />
      <p class={`${selectedId === n.id ? 'font-bold' : 'font-normal'}`}>
        {n.name} <span>({n.runs.length})</span>
      </p>
    </div>
  {/each}
</div>

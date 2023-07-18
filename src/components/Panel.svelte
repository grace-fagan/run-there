<script lang="ts">
  import type { Neighborhood } from '$types/neighborhoods/nyc';
  import { loadBoroughData } from '$lib/neighborhoods-utils';
  import { afterUpdate } from 'svelte';

  export let neighborhoods: Neighborhood[];
  export let selectedId: number;
  let prevSelectedNeighborhood: Neighborhood = null;
  $: selectedNeighborhood = selectedId ? neighborhoods.find((n) => n.id === selectedId) : null;

  const boroughs = loadBoroughData(neighborhoods);
  let visibility = new Map<number, boolean>(
    boroughs.map((b) => {
      const visible = selectedNeighborhood?.borough === b.id;
      return [b.id, visible];
    })
  );

  const getCompletedNeighborhoods = (neighborhoods: Neighborhood[]) =>
    neighborhoods.filter((f) => f.runs.length > 0).length;

  const toggleVisibility = (id: number) => {
    const visible = visibility.get(id);
    visibility = visibility.set(id, !visible);
  };

  const watchSelectedNeighborhood = (oldVal: Neighborhood, newVal: Neighborhood) => {
    if (oldVal) visibility = visibility.set(oldVal.borough, false);
    if (newVal) visibility = visibility.set(newVal.borough, true);
  };

  // handles watching the selected neighborhood value and retaining its old value
  afterUpdate(() => {
    if (prevSelectedNeighborhood?.id !== selectedNeighborhood?.id) {
      watchSelectedNeighborhood(prevSelectedNeighborhood, selectedNeighborhood);
      prevSelectedNeighborhood = selectedNeighborhood;
    }
  });
</script>

<div class="w-1/3 flex flex-col gap-2">
  <h2>Neighborhoods</h2>
  {#each boroughs as { id, name, color, neighborhoods, runs }}
    <div class="flex gap-4 cursor-pointer" on:pointerdown={() => toggleVisibility(id)}>
      <p>{runs.length}</p>
      <p>{name}</p>
      <p>{getCompletedNeighborhoods(neighborhoods)} / {neighborhoods.length}</p>
    </div>
    {#if visibility.get(id)}
      <div class="flex flex-col gap-2 overflow-scroll">
        {#each neighborhoods as n}
          <div on:pointerdown={() => (selectedId = n.id)}>
            <p>{n.name} <span>({n.runs.length})</span></p>
          </div>
        {/each}
      </div>
    {/if}
  {/each}
</div>

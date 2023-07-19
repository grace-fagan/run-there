<script lang="ts">
  import type { Neighborhood } from '$types/neighborhoods/nyc';
  import { loadBoroughData } from '$lib/neighborhoods-utils';
  import { afterUpdate } from 'svelte';
  import ProgressBar from './ProgressBar.svelte';

  export let neighborhoods: Neighborhood[];
  export let selectedId: number;

  let prevSelectedNeighborhood: Neighborhood = null;
  $: selectedNeighborhood = selectedId ? neighborhoods.find((n) => n.id === selectedId) : null;
  $: maxNeighborhoods = boroughs.reduce((a, b) => Math.max(a, b.neighborhoods.length), 0);

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

  const toggleNeighborhood = (id: number) => (selectedId = selectedId === id ? null : id);

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

<div class="flex flex-col w-1/3 gap-2 mt-8">
  <div class="grid grid-cols-[25px_100px_auto] gap-3">
    <p class="col-span-2">Runs</p>
    <p>Neighborhoods</p>
  </div>
  {#each boroughs as { id, name, color, neighborhoods, runs }}
    <div
      class="grid grid-cols-[25px_100px_auto] gap-3 cursor-pointer py-2"
      on:pointerdown={() => toggleVisibility(id)}
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
    {#if visibility.get(id)}
      <div class="flex flex-col gap-2 overflow-scroll p-2 bg-white rounded-md">
        {#each neighborhoods as n}
          <div
            class="flex gap-1 items-center cursor-pointer"
            on:pointerdown={() => toggleNeighborhood(n.id)}
          >
            <i
              class={`fa-solid fa-check text-md ${n.runs.length > 0 ? 'text-black' : 'text-white'}`}
            />
            <p class={`${selectedId === n.id ? 'font-bold' : 'font-normal'}`}>
              {n.name} <span>({n.runs.length})</span>
            </p>
          </div>
        {/each}
      </div>
    {/if}
  {/each}
</div>

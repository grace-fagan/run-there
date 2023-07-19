<script lang="ts">
  import type { Neighborhood } from '$types/neighborhoods/nyc';

  export let selectedId: number;
  export let neighborhoods: Neighborhood[];
  const toggleNeighborhood = (id: number) => (selectedId = selectedId === id ? null : id);
</script>

<div class="flex flex-col gap-2 overflow-scroll py-2 px-4 bg-white rounded-md">
  {#each neighborhoods as n}
    <div
      class="flex gap-2 items-center cursor-pointer"
      id={n.id.toString()}
      on:pointerdown={() => toggleNeighborhood(n.id)}
    >
      <i class={`fa-solid fa-check text-md ${n.runs.length > 0 ? 'text-black' : 'text-white'}`} />
      <p class={`${selectedId === n.id ? 'font-bold' : 'font-normal'}`}>
        {n.name} <span>({n.runs.length})</span>
      </p>
    </div>
  {/each}
</div>

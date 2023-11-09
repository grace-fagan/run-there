<script lang="ts">
  import { cityLoaded } from '$lib/store';

  export let city: string;
  export let featureMap: Map<number, string[]>;

  let hoodsCompleted = 0;
  let totalNeighborhoods = 0;

  $: if (featureMap) {
    hoodsCompleted = Array.from(featureMap.values()).filter((arr) => arr.length > 0).length;
    totalNeighborhoods = featureMap.size;
  }
  $: percentComplete = Math.round((hoodsCompleted / totalNeighborhoods) * 100);
</script>

<div class="flex w-full justify-between items-center h-10 md:h-16">
  <div class="flex flex-col items-start">
    <h1 class="text-3xl md:text-5xl">{city}</h1>
  </div>
  {#if $cityLoaded}
    <div class="flex flex-col items-end">
      <h2 class="text-2xl md:text-4xl">{hoodsCompleted} / {totalNeighborhoods}</h2>
      <p class="text-xs md:text-auto">{percentComplete}% of neighborhoods</p>
    </div>
  {:else}
    <p>Loading...</p>
  {/if}
</div>

<script lang="ts">
  export let city: string;
  export let numCompleted: number;
  export let totalNeighborhoods: number;
  $: percentComplete = Math.round((numCompleted / totalNeighborhoods) * 100);
</script>

<div class="flex w-full justify-between items-center h-10 md:h-16">
  <div class="flex flex-col items-start">
    <h1 class="text-3xl md:text-5xl">{city}</h1>
  </div>
  <div class="flex flex-col items-end">
    <h2 class="text-2xl md:text-4xl">{numCompleted} / {totalNeighborhoods}</h2>
    <p class="text-xs md:text-auto">{percentComplete}% of neighborhoods</p>
  </div>
</div>

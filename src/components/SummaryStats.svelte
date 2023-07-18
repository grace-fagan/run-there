<script lang="ts">
  export let neighborhoodsMap: Map<number, string[]>;
  export let numActivities: number;
  $: completed = Array.from(neighborhoodsMap.values()).filter((arr) => arr.length > 0).length;
  $: totalNeighborhoods = neighborhoodsMap.size;
</script>

<div class="flex flex-col gap-2 items-end">
  <div class="flex gap-1 items-center">
    <h2>{completed} / {totalNeighborhoods}</h2>
    <p>neighborhoods</p>
  </div>
  <div class="flex gap-1 items-center">
    <h2>{numActivities}</h2>
    <p>activities</p>
  </div>
</div>

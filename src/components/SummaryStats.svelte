<script lang="ts">
  export let neighborhoodsMap: Map<number, string[]>;
  export let numActivities: number;
  $: completed = Array.from(neighborhoodsMap.values()).filter((arr) => arr.length > 0).length;
  $: totalNeighborhoods = neighborhoodsMap.size;
</script>

<div class="flex flex-col gap-2">
  <h2>{completed} / {totalNeighborhoods} neighborhoods</h2>
  <h2>{numActivities} activities</h2>
</div>

<script lang="ts">
  export let city: string;
  export let numCompleted: number;
  export let totalNeighborhoods: number;
  export let numActivities: number;
</script>

<div class="flex w-full justify-between items-start h-16">
  <div class="flex gap-2 items-end">
    <h1>{city}</h1>
    <p>({numActivities} activities)</p>
  </div>
  <div class="flex flex-col items-end">
    <h1>{numCompleted} / {totalNeighborhoods}</h1>
    <p>neighborhoods</p>
  </div>
</div>

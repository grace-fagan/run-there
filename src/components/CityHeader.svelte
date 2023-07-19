<script lang="ts">
  export let city: string;
  export let numCompleted: number;
  export let totalNeighborhoods: number;
  export let numActivities: number;
</script>

<div class="flex w-full justify-between items-start h-16">
  <div class="flex flex-col items-start">
    <h2>{city}</h2>
    <p>({numActivities} activities)</p>
  </div>
  <div class="flex flex-col items-end">
    <h2>{numCompleted} / {totalNeighborhoods}</h2>
    <p>neighborhoods</p>
  </div>
</div>

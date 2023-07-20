<script lang="ts">
  export let city: string;
  export let numCompleted: number;
  export let totalNeighborhoods: number;
</script>

<div class="flex w-full justify-between items-center h-16">
  <div class="flex flex-col items-start">
    <h1>{city}</h1>
  </div>
  <div class="flex flex-col items-end">
    <h2>{numCompleted} / {totalNeighborhoods}</h2>
    <p>neighborhoods</p>
  </div>
</div>

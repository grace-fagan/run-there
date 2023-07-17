<script lang="ts">
  import type { NeighborhoodProperties } from '$types/neighborhoods/nyc';
  export let name: string;
  export let value: number;
</script>

<div class="absolute top-4 left-4 bg-white px-2 py-1 rounded-md">
  <div class="flex gap-2 items-center">
    <h1>{name}</h1>
    <p>({value})</p>
  </div>
</div>

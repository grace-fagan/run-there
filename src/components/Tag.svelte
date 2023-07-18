<script lang="ts">
  import type { Feature } from 'geojson';
  export let feature: Feature;
</script>

<div class="absolute top-4 left-4 bg-white px-2 py-1 rounded-md">
  <div class="flex gap-2 items-center">
    <h4>{feature.properties.name}</h4>
    <p>({feature.properties.value})</p>
  </div>
</div>

<script lang="ts">
  import { cityInfo } from '$lib/city-utils';
  import { Link } from 'svelte-routing';

  const cities = Object.entries(cityInfo);
</script>

<div class="flex gap-4">
  {#each cities as [cityKey, cityInfo]}
    <Link to="/{cityKey}" let:active>
      <p class={active ? 'font-bold underline' : ''}>{cityKey.toUpperCase()}</p>
    </Link>
  {/each}
</div>

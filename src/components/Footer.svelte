<script lang="ts">
  import { isMobile } from '$lib/store';
  import RefreshFooter from './RefreshFooter.svelte';
  import ViewOnStrava from './ViewOnStrava.svelte';
  export let numActivities: number;
</script>

<div
  class="flex flex-col gap-2 md:gap-0 md:flex-row md:justify-between justify-start h-8 md:items-center"
>
  <RefreshFooter {numActivities} />
  <div class="flex justify-between">
    {#if $isMobile}
      <ViewOnStrava />
    {/if}
    <img class="h-5 md:h-6" src="/static/img/api-horiz-gray.png" alt="Powered by Strava" />
  </div>
</div>

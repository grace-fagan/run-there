<script lang="ts">
  import { Router, Route } from 'svelte-routing';
  import Home from './routes/Home.svelte';
  import StravaRedirect from './routes/StravaRedirect.svelte';
  import { isMobile } from '$lib/store';
  import { onMount } from 'svelte';
  import CityPage from './routes/CityPage.svelte';

  const setIsMobile = () => ($isMobile = window.innerWidth <= 768);
  onMount(() => setIsMobile());
</script>

<svelte:window on:resize={setIsMobile} />

<Router>
  <Route path="/"><Home /></Route>
  <Route path="/redirect/:data"><StravaRedirect /></Route>
  <Route path="/:city" let:params><CityPage cityName={params.city} /></Route>
</Router>

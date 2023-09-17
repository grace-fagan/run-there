<script lang="ts">
  import { Router, Route } from 'svelte-routing';
  import Home from './routes/Home.svelte';
  import StravaRedirect from './routes/StravaRedirect.svelte';
  import NYC from './routes/NYC.svelte';
  import { isMobile } from '$lib/store';
  import { onMount } from 'svelte';
  import Chicago from './routes/Chicago.svelte';

  const setIsMobile = () => ($isMobile = window.innerWidth <= 768);
  onMount(() => setIsMobile());
</script>

<svelte:window on:resize={setIsMobile} />

<Router>
  <Route path="/"><Home /></Route>
  <Route path="/redirect/:data"><StravaRedirect /></Route>
  <Route path="/nyc"><NYC /></Route>
  <Route path="/chi"><Chicago /></Route>
</Router>

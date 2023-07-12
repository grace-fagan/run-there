<script lang="ts">
  import { Router, Route } from 'svelte-routing';
  import { authURL } from '$lib/server-utils';
  import Home from './routes/Home.svelte';
  import StravaRedirect from './routes/StravaRedirect.svelte';

  const handleLogin = () => {
    window.location.replace(authURL);
  };
</script>

<Router>
  <Route path="/"><Home /></Route>
  <Route path="/redirect/:data"><StravaRedirect /></Route>
</Router>

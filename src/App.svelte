<script lang="ts">
  import { Router, Route } from 'svelte-routing';
  import { authURL } from '$lib/auth-utils';
  import Home from './routes/Home.svelte';
  import StravaRedirect from './routes/StravaRedirect.svelte';
  import NYC from './routes/NYC.svelte';

  const handleLogin = () => {
    window.location.replace(authURL);
  };
</script>

<Router>
  <Route path="/"><Home /></Route>
  <Route path="/redirect/:data"><StravaRedirect /></Route>
  <Route path="/nyc"><NYC /></Route>
</Router>

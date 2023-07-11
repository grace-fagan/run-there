<script lang="ts">
  import { Router, Route } from 'svelte-routing';
  import { authURL } from '$lib/server-utils';
  import Home from './routes/Home.svelte';

  const handleLogin = () => {
    window.location.replace(authURL);
  };
</script>

<Router>
  <Route path="/" component={Home} />
</Router>
